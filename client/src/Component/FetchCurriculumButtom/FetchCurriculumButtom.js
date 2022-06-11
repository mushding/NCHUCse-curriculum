import React, { useState } from 'react';
import { 
    Button,
    Popover,
    Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

// import icon
import SettingsIcon from '@material-ui/icons/Settings';

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

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FetchCurriculumButtom = ({ refresh, semesterInfo }) => {
    const classes = useStyles();

    // isOpen
    const [settingStartPopover, setSettingStartPopover] = useState(null);
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handdleOpenPopover = (event) => {
        setSettingStartPopover(event.currentTarget);
    };
    const handdleClosePopover = () => {
        setSettingStartPopover(null);
    };
    const handdleCloseSnackBar = () => {
        setSnackBarOpen(false);
    }

    const handdleFetchCurriculum = async () => {
        setSettingStartPopover(null);
        await fetch(`/api/updateWebsite/'${semesterInfo['year']}/${semesterInfo['type']}`);
        setSnackBarOpen(true);
        await refresh();
    }

    const handdleUpdateCseWebsite = async () => {
        setSettingStartPopover(null);
        await fetch('/api/updateCseWebsite');
        setSnackBarOpen(true);
    }

    return (
        <div>
            <Button
                onClick={handdleOpenPopover}
                variant="contained"
                startIcon={<SettingsIcon />}
            >  
                更新網頁資料
            </Button>
            <Popover
                open={Boolean(settingStartPopover)}
                anchorEl={settingStartPopover}
                onClose={handdleClosePopover}
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
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SettingsIcon />}
                        onClick={handdleFetchCurriculum}
                    >
                        重新爬學校課表資料並更新
                    </Button>
                </div>
                <div className={classes.popoverPadding}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SettingsIcon />}
                        onClick={handdleUpdateCseWebsite}
                    >
                        同步更新至資工系網頁課表
                    </Button>
                </div>
            </Popover>
            <Snackbar 
                open={snackBarOpen} 
                autoHideDuration={6000} 
                onClose={handdleCloseSnackBar}
                // anchorOrigin={ 'bottom', 'right' }
                // key={'bottom' + 'right'}
            >
                <Alert onClose={handdleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
                    成功更新課表！
                </Alert>
            </Snackbar>
        </div>
    );
}

export default FetchCurriculumButtom;