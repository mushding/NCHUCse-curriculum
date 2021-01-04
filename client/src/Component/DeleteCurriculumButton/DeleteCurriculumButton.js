import React, { useState } from 'react';
import { 
    Button,
    Popover,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Backdrop,
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// import icon
import DeleteIcon from '@material-ui/icons/Delete';

// import const data
import constData from '../../Data/const';

const Circle = (props) => {
    var circleStyle = {
        padding: 10,
        // margin: 10,
        display:"inline-block",
        backgroundColor: props.bgColor,
        borderRadius: "50%",
        width: "0.1rem",
        height: "0.1rem"
    };
    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <div style={circleStyle}></div>
            <div style={{paddingLeft: "0.5rem"}}>{props.text}</div>
        </div>
    );
}

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

const DeleteCurriculumButton = (props) => {
    const classes = useStyles();

    // isOpen
    const [deletePopover, setDeletePopover] = useState(null);
    const [backdropOpen, setBackdropOpen] = useState(false);
    
    // data
    const [classID, setClassID] = useState(null);
    const [curriculumType, setCurriculumType] = useState(null);

    // text
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handdleDeleteCurriculum = (event) => {
        setDeletePopover(event.currentTarget);
    };
    const closeDeleteCurriculum = () => {
        setDeletePopover(null);
    };
    const handdleDropOpen = async () => {

        // check is empty
        if (curriculumType === null){
            alert("請選擇課表類別！");
            return;
        }

        let result;
        if (curriculumType === 1){
            result = await fetch('/api/getStaticByID/' + String(classID));
            result = await result.json();
            try{
                await setDeleteConfirmText("課表借用目的：" + String(result[0]["name"]) + "\n單位：" + String(result[0]["office"]) + "\n時間：" + String(result[0]["start_time"]) + " ~ " + String(result[0]["end_time"]));
            } catch (err) {
                alert("沒有這個 ID！請重新輸入");
                return;
            }
        } else if (curriculumType === 2){
            result = await fetch('/api/getTemporaryByID/' + String(classID));
            result = await result.json();
            try{
                await setDeleteConfirmText("課表借用目的：" + String(result[0]["name"]) + "\n單位：" + String(result[0]["office"]) + "\n日期：" + String(result[0]["date"]) + "\n時間：" + String(result[0]["start_time"]) + " ~ " + String(result[0]["end_time"]));
            } catch (err) {
                alert("沒有這個 ID！請重新輸入");
                return;
            }
        }

        setDeletePopover(null);
        setBackdropOpen(!backdropOpen);
    };
    const closeDropOpen = () => {
        setBackdropOpen(false);
        setClassID(null);
    };
    const selectCurriculumType = (event) => {
        setCurriculumType(event.target.value);
    };
    const handdleTextField = (event) => {
        setClassID(event.target.value);
    };
    const confirmDelete = async () => {
        let idJSON = {
            id: classID
        }
        if (curriculumType === 1){
            await fetch('/api/dropStatic', {
                method: 'POST',
                body: JSON.stringify(idJSON),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });
            await props.refresh();
            // window.location.reload();
        } else if (curriculumType === 2){
            await fetch('/api/dropTemporary', {
                method: 'POST',
                body: JSON.stringify(idJSON),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });
            await props.refresh();
            // window.location.reload();
        }  
    };

    return (
        <div>
            <Button
                onClick={handdleDeleteCurriculum}
                variant="contained"
                startIcon={<DeleteIcon />}
            >  
                刪除課表
            </Button>
            <Popover
                open={Boolean(deletePopover)}
                anchorEl={deletePopover}
                onClose={closeDeleteCurriculum}
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
                    <Typography className={classes.textPadding}>輸入要刪除的課表 ID：</Typography>
                    <TextField
                        id="outlined-number"
                        className={classes.textPadding}
                        label="Number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        onChange={handdleTextField}
                    />
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">課表類型</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={curriculumType}
                            onChange={selectCurriculumType}
                            label="curriculumType"
                        >
                        <MenuItem value={0}>
                            <Circle 
                                bgColor={constData.resourceData[0].instances[0].color}
                                text="網頁課表"
                            />
                        </MenuItem>
                        <MenuItem value={1}>
                            <Circle 
                                bgColor={constData.resourceData[0].instances[1].color}
                                text="固定借用"
                            />
                        </MenuItem>
                        <MenuItem value={2}>
                            <Circle 
                                bgColor={constData.resourceData[0].instances[2].color}
                                text="臨時借用"
                            />
                        </MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={handdleDropOpen}
                    >
                        刪除課表
                    </Button>
                </div>
            </Popover>
        
            <Backdrop className={classes.backdrop} open={backdropOpen} onClick={closeDropOpen}>
                <Paper className={classes.paper}>
                    <div className={classes.paperText}>
                        <Typography variant="h4">確認是否要刪除課表？</Typography>
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
                            startIcon={<DeleteIcon />}
                            onClick={confirmDelete}
                        >
                            刪除課表
                        </Button>
                    </div>
                </Paper>
            </Backdrop>
        </div>
    );
}

export default DeleteCurriculumButton;