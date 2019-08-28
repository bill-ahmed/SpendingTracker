import React, {useState} from 'react';
import AttachmentIcon from '@material-ui/icons/Attachment'
import CreateIcon from '@material-ui/icons/Create'
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

function QuickActions(props){
    // Equivalent of this.state
    const [open, setOpen] = useState(false);

    /**Handle opening the quick actions menu. */
    const handleOpen = () => {
        setOpen(true);
    }

    /**Handle closing the quick actions menu. */
    const handleClose = () => {
        setOpen(false);
    }

    return(
        <SpeedDial ariaLabel="Quick Actions Menu" open={open} icon={<SpeedDialIcon/>} 
        onBlur={handleClose} onClose={handleClose} onFocus={handleOpen} onMouseEnter={handleOpen} onMouseLeave={handleClose} direction="left">

            <SpeedDialAction key="Add Single Transaction" tooltipTitle="Single Transaction" icon={<CreateIcon/>} tooltipPlacement="bottom"
            onClick={props.handleSingleTransaction}/>

            <SpeedDialAction key="Bulk Upload" tooltipTitle="Bulk Upload" icon={<AttachmentIcon/>} tooltipPlacement="bottom"
            onClick={props.handleBulkTransaction}/>
        </SpeedDial>
    );
};

export default QuickActions;