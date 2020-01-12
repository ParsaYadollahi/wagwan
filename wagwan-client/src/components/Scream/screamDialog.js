import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CustomButton from '../../util/CustomBotton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import LikeButton from '../Profile/LikeButton'
import Comments from './Comments';
import CommentForm from './CommentForm';


// MUI tings
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';


// Redux tings
import { connect } from 'react-redux';
import { getScream, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
});

class ScreamDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPAth: ''
    };
    handleOpen = () => {
        this.setState({ open: true })
        this.props.getScream(this.props.screamId); // when open post, need to send req to server to get scream
    };

    componentDidMount() {
        if (this.props.openDialog) {
          this.handleOpen();
        };
    };
    handleOpen = () => { // Create a new path when opening a post
        let oldPath = window.location.pathname;
        const { userHandle, screamId } = this.props;
        const newPath = `/users/${userHandle}/scream/${screamId}`;

        if (oldPath === newPath) { // refresh the old path to not get lost
            oldPath = `/users/${userHandle}`; // changes the url
        };
        window.history.pushState(null, null, newPath); // Go to the new path i.e the mans comments window

        this.setState({ open: true, oldPath, newPath });
        this.props.getScream(this.props.screamId); // Get the scream info

    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath); // change the path back to "/"
        this.setState({ open: false });
        this.props.clearErrors(); // clear errors when closing
    };

    render() {
        const { classes,
            scream: {
                screamId,
                body,
                createdAt,
                likeCount,
                commentCount,
                userImage,
                userHandle,
                comments // array of comments
            },
            UI: { loading }
        } = this.props;

        const dialogMarkUp = loading ? (
            // Spinner
            <div className={classes.spinner}>
                <CircularProgress size={200} thickness={2}/>
            </div>
        ) : (
            <Grid container spacing={1}>
                {/* Image of commentor */}
                <Grid item sm={5}>
                    <img src={userImage} alt ="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7}>
                    {/* USERS NAME => link to their profile */}
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/users/${userHandle}` }>
                            @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSep} />
                    {/* Date */}
                    <Typography
                        variant="body2"
                        color="textSecondary">
                            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSep} />
                    {/* Content of comment */}
                    <Typography variant='body1'>
                        <span>{body}</span>
                    </Typography>

                    {/* Display like and comment count */}
                    <LikeButton screamId={screamId} />
                    <span>{likeCount} Likes</span>
                    <CustomButton tip="Comments">
                        <ChatIcon color="primary" />
                    </CustomButton>
                    <span>{commentCount} Comments</span>

                </Grid>
                <hr className={classes.visibleSep} />
                {/* Send the screamId to CommentForm => Creates its own comment */}
                <CommentForm screamId={screamId} />
                <Comments comments={comments} />
            </Grid>
        );

    return (
        <Fragment>
            <CustomButton // The expand button for the comments
                onClick={this.handleOpen}
                tip="Comment">
                    <ChatIcon color="primary" />
            </CustomButton>
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth>
                    {/* Close button */}
                    <CustomButton
                        tip='Close'
                        onClick={this.handleClose}
                        tipClassName={classes.closeButton}>
                            <CloseIcon />
                    </CustomButton>;
                    {/* Content of the scream */}
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkUp}
                    </DialogContent>
                </Dialog>
        </Fragment>
        );
    };

};

ScreamDialog.propTypes = {
    getScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    scream: state.data.scream,
    UI: state.UI
});

const mapActionsToProps = {
    getScream,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));
