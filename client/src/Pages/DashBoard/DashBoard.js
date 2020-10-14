import React from 'react'
import Paper from '@material-ui/core/Paper';
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
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

// import icon
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

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

export default class DashBoard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            currirulums: [],
        };
    }
    
    async componentWillMount(){
        let res = await fetch('/getWebsite');
        let currirulums = await res.json();
        this.setState({ currirulums });
    }

    render(){
        const { currirulums } = this.state;
        return(
            <div>
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
                        <Appointments/>
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