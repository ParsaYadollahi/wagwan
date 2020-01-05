import React, { Component } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from 'dayjs' // format the date
import relativeTime from 'dayjs/plugin/relativeTime' // relative time lib
import PropTypes from 'prop-types';
import CustomButton from '../util/CustomBotton';
import DeleteScream from './DeleteScream';
import ScreamDialogue from './screamDialog';
import LikeButton from './LikeButton';

// MUI tings
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography"

// Redux tings
import { connect } from 'react-redux';

// Icons
import ChatIcon from '@material-ui/icons/Chat';



const styles = {
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
};


class Screams extends Component {

    render() {
        dayjs.extend(relativeTime)
        const Link = require("react-router-dom").Link;
        const { classes,
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


        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScream screamId={screamId} /> // If the post is the users, allow delete possibility
        ) : null
        return (
            <Card className={classes.card}>
                <CardMedia
                image={userImage}
                title="Profile image" className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${userHandle}`}
                        color='inherit'>
                            {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton screamId={screamId} />
                    <span>{likeCount} Likes</span>
                    <CustomButton tip="Comments">
                        <ChatIcon color="primary" />
                    </CustomButton>
                    <span>{commentCount} comments</span>
                    <ScreamDialogue
                        screamId={screamId}
                        userHandle={userHandle} />
                </CardContent>
            </Card>
        )
    }
}

Screams.propTypes = {
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}


const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Screams));
