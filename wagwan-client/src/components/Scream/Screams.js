import React, { Component } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from 'dayjs' // format the date
import relativeTime from 'dayjs/plugin/relativeTime' // relative time lib
import PropTypes from 'prop-types';
import CustomButton from '../../util/CustomBotton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './screamDialog';
import LikeButton from '../Profile/LikeButton';
import { Link } from 'react-router-dom';


// MUI tings
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";

// Redux tings
import { connect } from 'react-redux';

// Icons
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';




const styles = theme => ({
    ...theme.spreadThis,
    card: {
        position: 'relative',
        marginBottom: 20,
        display: 'flex'
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
});


class Screams extends Component {

    render() {
        dayjs.extend(relativeTime)
        const {
            classes,
            scream : {
                body,
                createdAt,
                userImage,
                userHandle,
                screamId,
                likeCount,
                commentCount
            },
            user: {
                authenticated,
                credentials: { handle }
            }
        } = this.props; // destrcuture classes

        // Delete Button
        const deleteButton = authenticated && userHandle === handle ? ( // If the user is authenticated and the post is his
            <DeleteScream screamId={screamId} /> // If the post is the users, allow delete possibility
        ) : null

        return (
            <Card className={classes.card}>
                <CardMedia
                    image={userImage}
                    title="Profile image" className={classes.image}
                />
                <CardContent className={classes.content}>
                    <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${userHandle}`}
                        color='inherit'>
                            {userHandle}
                    </Typography>

                    {/* Delete Button */}
                    {deleteButton}

                    {/* CreateAt */}
                    <Typography
                        variant="body2"
                        color="textSecondary">
                            {dayjs(createdAt).fromNow()}
                    </Typography>

                    {/* Content */}
                    <Typography
                        variant="body1"
                        id="submitedCommentTest">
                            {body}
                    </Typography>

                    {/* Like button */}
                    <LikeButton
                        screamId={screamId}
                    />
                    <span style={{paddingRight: "10px"}}>{likeCount} Likes</span>

                    {/* Comments */}
                        <ScreamDialog
                            screamId={screamId}
                            userHandle={userHandle}
                            openDialog={this.props.openDialog}
                        />
                    <span>{commentCount} comments</span>

                    {/* Open scream dialogue */}
                    <Link to={`/users/${userHandle}/scream/${screamId}`} >
                        <CustomButton
                            tip="Expand"
                            tipClassName={classes.expandButton}>
                                <UnfoldMoreIcon color="primary" />
                        </CustomButton>
                    </Link>
                </CardContent>
            </Card>
        )
    }
}

Screams.propTypes = {
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}


const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Screams));
