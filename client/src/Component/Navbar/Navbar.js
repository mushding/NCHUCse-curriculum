import React, { useState } from 'react';
import { 
    Paper,
    Button,
    Popover
} from '@material-ui/core';

// import icon
import DeleteIcon from '@material-ui/icons/Delete';

// import const data
import constData from '../../Data/const';

function Navbar () {
    return (
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
                    <Button
                        onClick={this.handdleDeleteCurriculum}
                        variant="contained"
                        startIcon={<DeleteIcon />}
                    >  
                        刪除課表
                    </Button>
                    <Popover
                        open={Boolean(this.state.deletePopover)}
                        anchorEl={this.state.deletePopover}
                        onClose={this.closeDeleteCurriculum}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <div>
                            TEST
                        </div>
                    </Popover>
                </div>
                <div style={{ padding: "20px", float: 'right' }}>
                    <Button
                        onClick={this.handdleSettingStartSchool}
                        variant="contained"
                        startIcon={<DeleteIcon />}
                    >  
                        設定開學時間
                    </Button>
                    <Popover
                        open={Boolean(this.state.deletePopover)}
                        anchorEl={this.state.deletePopover}
                        onClose={this.closeDeleteCurriculum}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <div>
                            TEST
                        </div>
                    </Popover>
                </div>
            </Paper>
        </div>
    );
}

export default Navbar;