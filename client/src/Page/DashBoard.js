import React, { useState, useEffect, useCallback } from 'react'
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
    EditRecurrenceMenu,
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
import SettingStartSchoolButton from '../Component/SettingStartSchoolButton/SettingStartSchoolButton'
import FetchCurriculumButtom from '../Component/FetchCurriculumButtom/FetchCurriculumButtom';

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
            appointmentData={appointmentData.title 
                ? { ...appointmentData,
                    title: appointmentData.title.split('\n')[0]
                } : appointmentData}
            onFieldChange={onFieldChange}
            {...restProps}
        >
            <AppointmentForm.Label
                text="借用單位"
                type="title"
            />
            <AppointmentForm.TextEditor
                value={appointmentData.office}
                onValueChange={onOfficeChange}
                placeholder="借用單位"
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

const DashBoard = () => {
    const [curriculums, setCurriculums] = useState([]);
    const [currentClassroom, setCurrentClassroom] = useState('821');
    const [currentViewName, setCurrentViewName] = useState('Week');
    const [semesterInfo, setSemesterInfo] = useState({});

    const [version, setVersion] = useState('v2.2');

    useEffect(() => {
        initData();
    }, [currentClassroom])

    const initData = async () => {
        try {
            // initStartOfSchoolDate part
            let response = await fetch('api/getStartSchoolDate');
            let jsonData = await response.json();  
            let today = new Date();
            jsonData = jsonData[0];
            let semester_year = parseInt(jsonData["semester_year"]);
            let summerDate = new Date(String(semester_year + 1911));
            let winterDate = new Date(String(semester_year + 1912));
            
            summerDate.setMonth(parseInt(jsonData["summer_date_month"]) - 1, parseInt(jsonData["summer_date_day"]));
            winterDate.setMonth(parseInt(jsonData["winter_date_month"]) - 1, parseInt(jsonData["winter_date_day"]));

            // use before end of school to calculate the semester
            // semesterType first is  1, second is 2
            const info = {
                ...jsonData,
                year: jsonData["semester_year"],
                type: (today <= summerDate.setDate(summerDate.getDate() + 18 * 7)) ? "1" : "2"
            }
            
            // getBackendCurriculumData part
            let res = await fetch('/api/getWebsite/' + currentClassroom + "/" + info['year'] + "/" + info['type']);
            let data = await res.json();
            res = await fetch('/api/getStatic/' + currentClassroom + "/" + info['year'] + "/" + info['type']);
            data.push(...await res.json());
            res = await fetch('/api/getTemporary/' + currentClassroom + "/" + info['year'] + "/" + info['type']);
            data.push(...await res.json());

            // add id
            data.forEach((data, index) => data["id"] = index)
            
            // init setState part (only call ones)
            setSemesterInfo(info);

            // clear curriculums prevData won't correctly...
            // why...?
            setCurriculums([]);
            setCurriculums(data);
            console.log(data)
        } catch (e) {
            console.log(e);
        }
    }

    const updateNCHUWebsiteData = async () => {
        try {
            await fetch('/api/updateCseWebsite');
        } catch (e) {
            console.log(e);
        }
    }

    const currentClassroomChange = (e) => {
        let classroom = e.target.value;
        setCurrentClassroom(classroom);
    }

    const currentViewNameChange = (e) => {
        setCurrentViewName(e.target.value);
    }

    const commitEditChanges = async ({ added, changed, deleted }) => {
        // temporary
        // change -> (_, array id, change value, _)
        // delete -> (_, _, pkId type)

        // static
        // change -> (complete, array id, _)
        // delete -> (_, array id, change value, _)
        console.log(added, changed, deleted);
        if (added && !changed && !deleted){
            added.startDate = new Date(added.startDate.getTime() - added.startDate.getTimezoneOffset()*60000);
            added.endDate = new Date(added.endDate.getTime() - added.endDate.getTimezoneOffset()*60000);
            added.classroom = currentClassroom;
            added.semester_year = semesterInfo['year'];
            added.semester_type = semesterInfo['info'];
            // website
            if (added.curriculumType === 1){
                if (added.title === undefined || added.office === undefined){
                    alert("有資料欄位沒有填入！");
                } else {
                    await fetch('/api/addWebsite', {
                        method: 'POST',
                        body: JSON.stringify(added),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    })
                    // window.location.reload();
                }   // static
            } else if (added.curriculumType === 2){
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
                    // window.location.reload();
                }
            } else {
                alert("請選擇借用類別！");
            }
        // temporary changed or static deleted
        } else if (!added && changed && !deleted) {
            let target_id = Object.keys(changed);
            let target = curriculums[target_id];
            // static deleted
            if (target['curriculumType'] === 2) {
                await fetch('/api/addStatic', {
                    method: 'POST',
                    body: JSON.stringify(added),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
            // temporary changed
            } else if (target['curriculumType'] === 3) {
                await fetch('/api/addStatic', {
                    method: 'POST',
                    body: JSON.stringify(added),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
            }
        }
        // magic way to trigger useEffect...
        const refresh = currentClassroom;
        setCurrentClassroom('0');
        setCurrentClassroom(refresh);
    }

    return (
            <div>
                <Paper>
                    <div style={{ paddingLeft: '20px', paddingTop: '10px', float: 'left' }}>
                        <ExternalClassroomSelector
                            currentClassroom={currentClassroom}
                            onChange={currentClassroomChange}
                        />
                    </div>
                    <div style={{ padding: "20px", float: 'right' }}>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/mushding/NCHUCse-curriculum"><GitHubIcon/></a>
                    </div>
                    <h4 style={{ float: 'right' }}>中興大學資工系教室借用表 {version}</h4>
                    <div style={{ paddingRight: '10px', paddingTop: '10px', float: 'right' }}>
                        <ExternalViewSwitcher
                            currentViewName={currentViewName}
                            onChange={currentViewNameChange}
                        />
                    </div>
                    <div style={{ padding: "20px", float: 'right' }}>
                        <DeleteCurriculumButton 
                            // refresh={getBackendCurriculumData}
                            semesterYear={semesterInfo['year']}
                            semesterType={semesterInfo['type']}
                        />
                    </div>
                    <div style={{ padding: "20px", float: 'right' }}>
                        <SettingStartSchoolButton 
                            // refresh={getBackendCurriculumData}
                            semesterInfo={semesterInfo}
                        />
                    </div>
                    <div style={{ padding: "20px", float: 'right' }}>
                        <FetchCurriculumButtom 
                            // refresh={getBackendCurriculumData}
                            semesterYear={semesterInfo['year']}
                            semesterType={semesterInfo['type']}
                        />
                    </div>
                </Paper>
                <Paper>
                    <Scheduler
                        data={curriculums}
                        // height={screenHeight}
                        firstDayOfWeek={1}
                        locale={"zh-TW"}
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
                            onCommitChanges={commitEditChanges}
                        />
                        <IntegratedEditing/>
                        {/* <EditRecurrenceMenu
                            messages={constData.editRecurrenceMenuMessage}
                        /> */}
                        <ConfirmationDialog 
                            messages={constData.confirmationDialogMessage}
                        />
                        <Toolbar />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments
                            appointmentComponent={Appointment}
                        />
                        <AppointmentTooltip
                            contentComponent={Content}
                            showOpenButton
                            showDeleteButton
                            showCloseButton
                        />
                        <Resources
                            data={constData.resourceData}
                        />
                        <AppointmentForm
                            basicLayoutComponent={BasicLayout}
                            textEditorComponent={TextEditor}
                            // booleanEditorComponent={BooleanEditor}
                            messages={constData.appointmentFormMessages}
                        />
                    </Scheduler>
                </Paper>
                <p style={{ textAlign: "center", color: "#808080", fontSize: "12px" }}>© 中興大學資工系教室借用表 - made by <a href="mailto:ajy1005464@gmail.com?subject=回報課表系統相關 bug" style={{ color: "#808080" }}>mushding</a></p>
            </div>
        )
}

export default DashBoard;