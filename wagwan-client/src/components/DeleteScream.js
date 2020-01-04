import React, { Component, Fragment } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from 'prop-types';
import CustomButton from '../util/CustomBotton';

// MUI tings
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deleteScream } from '../redux/actions/dataActions';


const styles = {
    deleteButton: {
        left: "92%",
        position: "absolute",
        top: "3%"
    }
}



class DeleteScream extends Component {
    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({ open: true })
    }
    handleClose = () => {
        this.setState({ open: false })
    }
    deleteScream = () => {
        this.props.deleteScream(this.props.screamId); // passed down from the scream
        this.setState({ open: false }); // once we delete sceam, close dialog
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <CustomButton
                    tip="Delete Post"
                    onClick={this.handleOpen}
                    btnClassName={classes.deleteButton}>
                        <DeleteOutline color="secondary" />
                </CustomButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                    >
                     <DialogTitle>
                         You sure you finna delete the post?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='primary'>
                            Cancel
                        </Button>
                        <Button onClick={this.deleteScream} color='secondary'>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteScream.propTypes = {
    deleteScream: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired
}


// Don't need map state to props, dont need statem only action
export default connect(null, { deleteScream })(withStyles(styles)(DeleteScream));
