import React from 'react'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
    Toolbar,
    DateNavigator,
    TodayButton,
    AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';

// import icon
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { 
    Paper,
    Grid,
    RadioGroup, 
    FormControlLabel,
    Radio
} from '@material-ui/core';

// import curriculum data
// import { curriculums } from '../../Data/SchedulerData'

const style = ({ palette }) => ({
    icon: {
        color: palette.action.active,
    },
    textCenter: {
        textAlign: 'center',
    },
    header: {
        height: '260px',
        backgroundSize: 'cover',
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
            fontSize: '15px'
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
                <AssignmentIcon className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
                <span>{appointmentData.name}</span>
            </Grid>
            <Grid item xs={2} className={classes.textCenter}>
                <AssignmentIcon className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
                <span>{appointmentData.grade}</span>
            </Grid>
            <Grid item xs={2} className={classes.textCenter}>
                <AssignmentIndIcon className={classes.icon} />
            </Grid>
            <Grid item xs={10}>
                <span>{appointmentData.teacher}</span>
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
            currentClassroom: '821'
        };
    }
    
    async componentWillMount(){
        let res = await fetch('/getWebsite');
        let currirulums = await res.json();
        this.setState({ currirulums });
    }

    async currentClassroomChange = (e) => {
        this.setState({ currentClassroom: e.target.value });
        
    }

    render(){
        const { currirulums, currentClassroom } = this.state;
        return(
            <div>
                <ExternalClassroomSelector
                    currentClassroom={currentClassroom}
                    onChange={this.currentClassroomChange}
                />
                <Paper>
                    <Scheduler
                        data={currirulums}
                    >
                        <ViewState/>
                        <WeekView
                            startDayHour={8}
                            endDayHour={22}
                        />
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
                    </Scheduler>
                </Paper>
            </div>
        )
    }
}