import React from 'react'
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    MonthView,
    Appointments,
    AppointmentForm,
    ConfirmationDialog,
    Toolbar,
    DateNavigator,
    TodayButton,
    Resources,
    AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';

// import icon
import GitHubIcon from '@material-ui/icons/GitHub';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';

import { 
    Paper,
    Grid,
    RadioGroup, 
    FormControlLabel,
    Radio,
} from '@material-ui/core';

// import const data
import constData from '../Data/const';

// import Component
import DeleteCurriculumButton from '../Component/DeleteCurriculumButton/DeleteCurriculumButton';

const style = ({ palette }) => ({
    icon: {
        color: palette.action.active,
    },
    textCenterFirst: {
        textAlign: 'center',
        padding: '8px'
    },
    textCenter: {
        textAlign: 'center',
        padding: '4px'
    },
}); 

const Appointment = ({
    children, style, ...restProps
}) => (
    <Appointments.Appointment
        {...restProps}
        style={{
            ...style,
            borderRadius: '0px',
            fontSize: '15px',
        }}
    >
        {children}
    </Appointments.Appointment>
);

const Content = withStyles(style, { name: 'Content' })(({
    children, appointmentData, classes, ...restProps
}) => (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
        <Grid container alignItems="center">
            <Grid item xs={2} className={classes.textCenterFirst}>
                <FormatListNumberedIcon className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
                <span>ID：{appointmentData.pkId}</span>
            </Grid>
            <Grid item xs={2} className={classes.textCenter}>
                <AlarmAddIcon className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
                <span>課表新增時間：{appointmentData.addtime}</span>
            </Grid>
        </Grid>
    </AppointmentTooltip.Content>
));

const TextEditor = (props, { ...restProps }) => {
    if (props.type === "multilineTextEditor") {
        return null;
    }
    return <AppointmentForm.TextEditor {...props} />;
};

const BooleanEditor = (props, { ...restProps }) => {
    if (props.label === "All Day") {
        return null;
    } 
    if (props.label === "Repeat") {
        return null;
    }
    return <AppointmentForm.BooleanEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const onOfficeChange = (nextValue) => {
        onFieldChange({ office: nextValue });
    };
    return (
        <AppointmentForm.BasicLayout
            appointmentData={appointmentData}
            onFieldChange={onFieldChange}
            {...restProps}
        >
            <AppointmentForm.Label
                text="借用單位"
                type="title"
            />
            <AppointmentForm.TextEditor
                value={appointmentData.office}
                onValueChange={onOfficeChange}
                placeholder="借用單位"
            />
        </AppointmentForm.BasicLayout>
    );
};

const ExternalViewSwitcher = ({
    currentViewName,
    onChange,
}) => (
    <RadioGroup
        aria-label="Views"
        style={{ flexDirection: 'row' }}
        name="views"
        value={currentViewName}
        onChange={onChange}
    >
        <FormControlLabel value="Week" control={<Radio />} label="週" />
        <FormControlLabel value="Month" control={<Radio />} label="月" />
    </RadioGroup>
);

const ExternalClassroomSelector = ({
    currentClassroom,
    onChange
}) => (
    <RadioGroup
        aria-label="Classrooms"
        style={{ flexDirection: "row" }}
        name="classrooms"
        value={ currentClassroom }
        onChange={ onChange }
    >
        {constData.classroomIndex.map((classroom, index) => {
            return (
                <FormControlLabel value={classroom} control={<Radio/>} label={classroom} key={index} />
            )
        })}
    </RadioGroup>
);

export default class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            // component state
            deletePopover: null,

            // curriculum state
            currirulums: [],
            currentClassroom: '821',
            currentViewName: 'Week',
            resources: constData.resourceData,
            semesterYear: '',
            semesterType: '',

            // other global state
            version: 'v2.1',
        };
    }
    
    async componentWillMount(){
        await this.initStartOfSchoolDate();
        await this.updateWebsiteCurriculum();
        await this.getBackendCurriculumData();
    }

    initStartOfSchoolDate = async () => {
        try {
            let response = await fetch('api_flask/getStartSchoolDate');
            let jsonData = await response.json();  
            let today = new Date();
            let summerDate = new Date(String(jsonData["year"] + 1911) + "-" + jsonData["9"]["month"] + "-" + jsonData["9"]["date"]);
            let winterDate = new Date(String(jsonData["year"] + 1912) + "-" + jsonData["2"]["month"] + "-" + jsonData["2"]["date"]);
            
            // use before end of school to calculate the semester
            this.setState({ semesterYear: String(jsonData["year"]) });
            if (today <= summerDate.setDate(summerDate.getDate() + 18 * 7)){
                this.setState({ semesterType: "上學期" });
            } else if (today <= winterDate.setDate(winterDate.getDate() + 18 * 7)){
                this.setState({ semesterType: "下學期" });
            }
        } catch (e) {
            console.log(e);
        }
        let res = await fetch('/api/initStartOfSchoolDate');
    }

    updateWebsiteCurriculum = async () => {
        let res = await fetch('/api/updateWebsite/' + this.state.semesterYear + "/" + this.state.semesterType);
    }

    getBackendCurriculumData = async () => {
        let res = await fetch('/api/getWebsite/' + this.state.currentClassroom + "/" + this.state.semesterYear + "/" + this.state.semesterType);
        let currirulums = await res.json();
        res = await fetch('/api/getStatic/' + this.state.currentClassroom + "/" + this.state.semesterYear + "/" + this.state.semesterType);
        currirulums.push(...await res.json());
        res = await fetch('/api/getTemporary/' + this.state.currentClassroom + "/" + this.state.semesterYear + "/" + this.state.semesterType);
        currirulums.push(...await res.json());
        this.setState({ currirulums });
    }

    currentClassroomChange = async (e) => {
        let classroom = e.target.value;
        await this.setState({ currentClassroom: classroom });
        this.getBackendCurriculumData();
    }

    currentViewNameChange = (e) => {
        this.setState({ currentViewName: e.target.value });
    }

    commitEditChanges = async ({ added, changed, deleted }) => {
        console.log(added, changed, deleted);
        if (changed || deleted !== undefined)
            alert("目前不開放此功能");
        else if (added){
            added.startDate = new Date(added.startDate.getTime() - added.startDate.getTimezoneOffset()*60000);
            added.endDate = new Date(added.endDate.getTime() - added.endDate.getTimezoneOffset()*60000);
            added.classroom = this.state.currentClassroom;
            added.semester_year = this.state.semesterYear;
            added.semester_type = this.state.semesterType;
            // static 
            if (added.curriculumType === 2){
                if (added.title === undefined || added.office === undefined){
                    alert("有資料欄位沒有填入！");
                } else {
                    await fetch('/api/addStatic', {
                        method: 'POST',
                        body: JSON.stringify(added),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    })
                    await this.getBackendCurriculumData();
                    // window.location.reload();
                }   // temporary
            } else if (added.curriculumType === 3){
                if (added.title === undefined || added.office === undefined){
                    alert("有資料欄位沒有填入！");
                } else {
                    await fetch('/api/addTemporary', {
                        method: 'POST',
                        body: JSON.stringify(added),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    })
                    await this.getBackendCurriculumData();
                    // window.location.reload();
                }
            } else {
                alert("請選擇借用類別！");
            }
        } 
    }

    render(){
        const { currirulums, currentViewName ,currentClassroom, resources } = this.state;
        return(
            <div>
                <Paper>
                    <div style={{ paddingLeft: '20px', paddingTop: '10px', float: 'left' }}>
                        <ExternalClassroomSelector
                            currentClassroom={currentClassroom}
                            onChange={this.currentClassroomChange}
                        />
                    </div>
                    <div style={{ padding: "20px", float: 'right' }}>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/mushding/NCHUCse-curriculum"><GitHubIcon/></a>
                    </div>
                    <h4 style={{ float: 'right' }}>中興大學資工系教室借用表 {this.state.version}</h4>
                    <div style={{ paddingRight: '10px', paddingTop: '10px', float: 'right' }}>
                        <ExternalViewSwitcher
                            currentViewName={currentViewName}
                            onChange={this.currentViewNameChange}
                        />
                    </div>
                    <div style={{ padding: "20px", float: 'right' }}>
                        <DeleteCurriculumButton 
                            refresh={this.getBackendCurriculumData}
                            semesterYear={this.state.semesterYear}
                            semesterType={this.state.semesterType}
                        />
                    </div>
                </Paper>
                <Paper>
                    <Scheduler
                        data={currirulums}
                        // height={screenHeight}
                        firstDayOfWeek={1}
                    >
                        <ViewState
                            currentViewName={currentViewName}
                        />
                        <WeekView
                            startDayHour={8}
                            endDayHour={23}
                        />
                        <MonthView/>
                        <EditingState
                            onCommitChanges={this.commitEditChanges}
                        />
                        <IntegratedEditing/>
                        <ConfirmationDialog />
                        <Toolbar />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments
                            appointmentComponent={Appointment}
                        />
                        <AppointmentTooltip
                            contentComponent={Content}
                            showCloseButton
                        />
                        <Resources
                            data={resources}
                        />
                        <AppointmentForm
                            basicLayoutComponent={BasicLayout}
                            textEditorComponent={TextEditor}
                            booleanEditorComponent={BooleanEditor}
                            messages={constData.messages}
                        />
                    </Scheduler>
                </Paper>
                <p style={{ textAlign: "center", color: "#808080", fontSize: "12px" }}>© 中興大學資工系教室借用表 - made by <a href="mailto:ajy1005464@gmail.com?subject=回報課表系統相關 bug" style={{ color: "#808080" }}>mushding</a></p>
            </div>
        )
    }
}