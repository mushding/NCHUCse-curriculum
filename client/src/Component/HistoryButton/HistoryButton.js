import React from 'react';
import { IconButton } from '@material-ui/core';

// import icon
import AssignmentIcon from "@material-ui/icons/Assignment";

const HistoryButton = () => {
    return (
        <div>
            <IconButton
                target="_blank" 
                href="https://hackmd.io/@mushding/rknPcVEF5"
            >
                <AssignmentIcon />
            </IconButton>
        </div>
    );
}

export default HistoryButton;