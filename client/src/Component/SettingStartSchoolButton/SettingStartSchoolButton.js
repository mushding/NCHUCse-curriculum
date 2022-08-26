import React, { useEffect, useState } from 'react';
import { 
    Button,
    Backdrop,
    Paper,
    Popover,
    TextField,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// import icon
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
    popoverPadding: {
        padding: theme.spacing(3),
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

const SettingStartSchoolButton = ({ semesterInfo }) => {
    const classes = useStyles();

    // isOpen
    const [settingStartPopover, setSettingStartPopover] = useState(null);
    const [backdropOpen, setBackdropOpen] = useState(false);

    // text
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // semester date
    const [semesterYear, setSemesterYear] = useState('');
    const [summerDate, setSummerDate] = useState('');
    const [winterDate, setWinterDate] = useState('');

    useEffect(() => {
        setSemesterYear("目前設定：" + semesterInfo['year']);
        setSummerDate("目前設定：" + semesterInfo["summer_date_month"] + "/" + semesterInfo["summer_date_day"]);
        setWinterDate("目前設定：" + semesterInfo["winter_date_month"] + "/" + semesterInfo["winter_date_day"]);
    }, [semesterInfo]);

    const handdleStartSchool = (event) => {
        setSettingStartPopover(event.currentTarget);
    };
    const closeStartSchool = () => {
        setSettingStartPopover(null);
    };
    const openBackdrop = () => {
        setDeleteConfirmText("本學期學年度：" + semesterYear + "\n上學期開學日期：" + summerDate + "\n下學期開學日期：" + winterDate);
        
        closeStartSchool();
        setBackdropOpen(!backdropOpen);
    };
    const closeDropOpen = () => {
        setBackdropOpen(false);
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
        // check if C.E
        if (parseInt(semesterYear) > 2000){
            alert("請輸入民國年！");
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
        window.location.reload();
    };

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
                    <Typography className={classes.textPadding}>輸入本學期學年度 (民國年)：</Typography>
                    <form noValidate autoComplete="off">
                        <TextField 
                            id="outlined-basic" 
                            label={semesterYear} 
                            variant="outlined" 
                            className={classes.textPadding}
                            placeholder="學年度"
                            onChange={handdleSemesterYear}
                        />
                    </form>
                    <Typography className={classes.textPadding}>輸入上學期開學日期：</Typography>
                    <form noValidate autoComplete="off">
                        <TextField 
                            id="outlined-basic" 
                            label={summerDate} 
                            variant="outlined" 
                            className={classes.textPadding}
                            placeholder="上學期開學日期"
                            onChange={handdleSummerDate}
                        />
                    </form>
                    <Typography className={classes.textPadding}>輸入下學期開學日期：</Typography>
                    <form noValidate autoComplete="off">
                        <TextField 
                            id="outlined-basic" 
                            label={winterDate} 
                            variant="outlined" 
                            className={classes.textPadding}
                            placeholder="下學期開學日期"
                            onChange={handdleWinterDate}
                        />
                    </form>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SettingsIcon />}
                        onClick={openBackdrop}
                    >
                        修改開學時間
                    </Button>
                </div>
            </Popover>
            <Backdrop className={classes.backdrop} open={backdropOpen} onClick={closeDropOpen}>
                <Paper className={classes.paper}>
                    <div className={classes.paperText}>
                        <Typography variant="h4">確認學期資料無誤？</Typography>
                    </div>
                    <div className={classes.paperText}>
                        <Typography variant="h5" className={classes.curriculumContent}>{deleteConfirmText}</Typography>
                    </div>
                    <div className={classes.paperButton}>
                        <Button
                            variant="contained"
                            onClick={closeDropOpen}
                        >
                            取消 (或按其它地方)
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<SettingsIcon />}
                            onClick={handdleSettingStart}
                        >
                            確認更新
                        </Button>
                    </div>
                </Paper>
            </Backdrop>
        </div>
    );
}

export default SettingStartSchoolButton;