import React, { useState } from 'react';
import { 
    Button,
    Popover,
    TextField,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// import icon
import SettingsIcon from '@material-ui/icons/Settings';

// import const data
import constData from '../../Data/const';

const useStyles = makeStyles((theme) => ({
    popoverPadding: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
    textPadding: {
        paddingBottom: theme.spacing(2),
    },
    selectTextPadding: {
        paddingLeft: theme.spacing(1), 
    },
    formControl: {
        paddingBottom: theme.spacing(2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: theme.spacing(10),
        width: "50%",
        height: "50%",
    },
    paperText: {
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center", 
    },
    paperButton: {
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around", 
    },
    curriculumContent: {
        whiteSpace: "pre-wrap",
    }
}));

const SettingStartSchoolButton = (props) => {
    const classes = useStyles();

    // isOpen
    const [settingStartPopover, setSettingStartPopover] = useState(null);

    // semester date
    const [semesterYear, setSemesterYear] = useState('');
    const [summerDate, setSummerDate] = useState('');
    const [winterDate, setWinterDate] = useState('');

    const handdleStartSchool = (event) => {
        setSettingStartPopover(event.currentTarget);
    };
    const closeStartSchool = () => {
        setSettingStartPopover(null);
    };
    const handdleSemesterYear = (e) => {
        setSemesterYear(e.target.value);
    }
    const handdleSummerDate = (e) => {
        setSummerDate(e.target.value);
    }
    const handdleWinterDate = (e) => {
        setWinterDate(e.target.value);
    }
    const handdleSettingStart = async () => {

        // check is empty
        if (semesterYear === '' || summerDate === '' || winterDate === ''){
            alert("請輸入開學的學期以及日期！");
            return;
        }

        const date = {
            'semesterYear': semesterYear,
            'summerDate': summerDate,
            'winterDate': winterDate,
        }

        await fetch('/api/setStartSchoolDate', {
            method: 'POST',
            body: JSON.stringify(date),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        closeStartSchool();
        updateWebsiteCurriculum();
        await props.refresh();
    };

    const updateWebsiteCurriculum = async () => {
        let res = await fetch('/api/updateWebsite/' + this.state.semesterYear + "/" + this.state.semesterType);
    }

    return (
        <div>
            <Button
                onClick={handdleStartSchool}
                variant="contained"
                startIcon={<SettingsIcon />}
            >  
                設定開學時間
            </Button>
            <Popover
                open={Boolean(settingStartPopover)}
                anchorEl={settingStartPopover}
                onClose={closeStartSchool}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.popoverPadding}>
                    <Typography className={classes.textPadding}>輸入本學期學年度：</Typography>
                    <form noValidate autoComplete="off">
                        <TextField 
                            id="outlined-basic" 
                            label="學年度" 
                            variant="outlined" 
                            className={classes.textPadding}
                            placeholder="(ex: 110)"
                            onChange={handdleSemesterYear}
                        />
                    </form>
                    <Typography className={classes.textPadding}>輸入上學期開學日期：</Typography>
                    <form noValidate autoComplete="off">
                        <TextField 
                            id="outlined-basic" 
                            label="上學期開學日期" 
                            variant="outlined" 
                            className={classes.textPadding}
                            placeholder="(ex: 9/1)"
                            onChange={handdleSummerDate}
                        />
                    </form>
                    <Typography className={classes.textPadding}>輸入下學期開學日期：</Typography>
                    <form noValidate autoComplete="off">
                        <TextField 
                            id="outlined-basic" 
                            label="下學期開學日期" 
                            variant="outlined" 
                            className={classes.textPadding}
                            placeholder="(ex: 3/1)"
                            onChange={handdleWinterDate}
                        />
                    </form>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SettingsIcon />}
                        onClick={handdleSettingStart}
                    >
                        修改開學時間
                    </Button>
                </div>
            </Popover>
        </div>
    );
}

export default SettingStartSchoolButton;