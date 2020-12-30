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


const DeleteCurriculumButton = () => {
    const [deletePopover, setDeletePopover] = useState(null);

    const handdleDeleteCurriculum = (event) => {
        setDeletePopover(event.currentTarget);
    }
    const closeDeleteCurriculum = () => {
        setDeletePopover(null);
    }

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
                <div>
                    TEST
                </div>
            </Popover>
        </div>
    );
}

export default DeleteCurriculumButton;