import React from 'react'

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default ({ children, tip, onClick, btnClassName, tipClassName, styles }) => (
    <Tooltip title={tip} className={tipClassName} placement='top'>
        <IconButton onClick={onClick} className={btnClassName} style={{styles}}>
            {children}
        </IconButton>
    </Tooltip>
);
