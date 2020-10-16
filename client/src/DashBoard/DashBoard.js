import React from 'react'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    MonthView,
    Appointments,
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
import { 
    Paper,
    Grid,
    RadioGroup, 
    FormControlLabel,
    Radio
} from '@material-ui/core';

const style = ({ palette }) => ({
    icon: {
        color: palette.action.active,
    },
    textCenter: {
        textAlign: 'center',
        padding: '8px'
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
            whiteSpace: 'pre-wrap'
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
            <Grid item xs={2} className={classes.textCenter}>
                <AlarmAddIcon className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
                <span>課表新增時間：{appointmentData.addtime}</span>
            </Grid>
        </Grid>
    </AppointmentTooltip.Content>
));

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
        <FormControlLabel value="803" control={<Radio/>} label="803"/>
        <FormControlLabel value="821" control={<Radio/>} label="821"/>
        <FormControlLabel value="1002" control={<Radio/>} label="1002"/>
        <FormControlLabel value="1007" control={<Radio/>} label="1007"/>
        <FormControlLabel value="1019" control={<Radio/>} label="1019"/>
        <FormControlLabel value="241" control={<Radio/>} label="241"/>
        <FormControlLabel value="242" control={<Radio/>} label="242"/>
        <FormControlLabel value="335" control={<Radio/>} label="335"/>
        <FormControlLabel value="336" control={<Radio/>} label="336"/>
        <FormControlLabel value="337" control={<Radio/>} label="337"/>
        <FormControlLabel value="338" control={<Radio/>} label="338"/>
    </RadioGroup>
);

export default class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            currirulums: [],
            currentClassroom: '821',
            currentViewName: 'Week',
            // screenHeight: window.innerHeight,
            resources: [
                {
                    fieldName: 'curriculumType',
                    title: 'CurriculumType',
                    instances: [
                        { id: 1, text: '網頁課表', color: "#838bb2" },
                        { id: 2, text: '固定借用', color: "#e4a99b" },
                        { id: 3, text: '臨時借用', color: "#ada142" },
                    ]
                }
            ]
        };
    }
    
    componentWillMount(){
        this.getBackendCurriculumData();
    }

    getBackendCurriculumData = async () => {
        let res = await fetch('/getWebsite/' + this.state.currentClassroom);
        let currirulums = await res.json();
        res = await fetch('/getStatic/' + this.state.currentClassroom);
        currirulums.push(...await res.json());
        res = await fetch('/getTemporary/' + this.state.currentClassroom);
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
                    <h4 style={{float: 'right' }}>中興大學資工系教室借用表 v2.0</h4>
                    <div style={{ paddingRight: '10px', paddingTop: '10px', float: 'right' }}>
                        <ExternalViewSwitcher
                            currentViewName={currentViewName}
                            onChange={this.currentViewNameChange}
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
                    </Scheduler>
                </Paper>
                <p style={{ textAlign: "center", color: "#808080", fontSize: "12px" }}>© 中興大學資工系教室借用表 - made by <a href="mailto:ajy1005464@gmail.com?subject=回報課表系統相關 bug" style={{ color: "#808080" }}>mushding</a></p>
            </div>
        )
    }
}