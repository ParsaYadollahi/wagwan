import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CustomButton from '../util/CustomBotton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// MUI tings
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';


// Redux tings
import { connect } from 'react-redux';
import { getScream } from '../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    invisibleSep: {
        border: 'none',
        margin: 4
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    DialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {
        position: 'absolute',
        left: '92%'
    },
    spinner: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50,

    }
});

class ScreamDialog extends Component {
    state = {
        open: false,
    };
    handleOpen = () => {
        this.setState({ open: true })
        this.props.getScream(this.props.screamId); // when open post, need to send req to server to get scream
    };
    handleClose = () => {
        this.setState({ open: false })
    };

    render() {
        const { classes,
            scream: {
                scream:
                screamId,
                body,
                createdAt,
                likeCount,
                commentCount,
                userImage,
                userHandle
            },
            UI: { loading }
        } = this.props

        const dialogMarkUp = loading ? (
            <div className={classes.spinner}>
                <CircularProgress size={200} thickness={2}/>
            </div>
        ) : (
            <Grid container spacing={16}>
                <Grid item sm={5}>
                    <img src={userImage} alt ="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/users/${userHandle}` }>
                            @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSep} />
                    <Typography
                        variant="body2"
                        color="textSecondary">
                            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSep} />
                    <Typography variant='body1'>
                        {body}
                    </Typography>
                </Grid>
            </Grid>
        )

    return (
        <Fragment>
            <CustomButton
                onClick={this.handleOpen}
                tip="Expand Post"
                tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
            </CustomButton>
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                minWidth='sm'>
                    <CustomButton
                        tip='Close'
                        onClick={this.handleClose}
                        tipClassName={classes.closeButton}>
                            <CloseIcon />
                    </CustomButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkUp}
                    </DialogContent>
                </Dialog>
        </Fragment>
        )
    }

}

ScreamDialog.Prototype = {
    getScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    scream: state.data.scream,
    UI: state.UI
})

const mapActionsToProps = {
    getScream
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));
