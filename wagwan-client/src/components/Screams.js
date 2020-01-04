import React, { Component } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from 'dayjs' // format the date
import relativeTime from 'dayjs/plugin/relativeTime' // relative time lib
import PropTypes from 'prop-types';
import CustomButton from '../util/CustomBotton';
import DeleteScream from './DeleteScream';


// MUI tings
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography"

// Redux tings
import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../redux/actions/dataActions';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';




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
    likedScream = () => {
        // Check if theres a likes in user object
        if (this.props.user.likes &&
            this.props.user.likes.find(like => like.screamId === this.props.scream.screamId)) {
            return true;
        } else {
            return false;
        }
    };

    likeScream = () => {
        this.props.likeScream(this.props.scream.screamId);
      };
    unlikeScream = () => {
        this.props.unlikeScream(this.props.scream.screamId);
    };

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
            const likeButton = !authenticated ? ( // Not logged in
                <CustomButton tip='Like'>
                    <Link to='/login'>
                        <FavoriteBorder color="primary" />
                    </Link>
                </CustomButton>
            ) : this.likedScream() ? ( // If returns true, means its present in the array (If user is logged in)
                    <CustomButton tip='Unlike' onClick={this.unlikeScream}>
                        <FavoriteIcon color="primary" />
                    </CustomButton>
                ) : (
                    <CustomButton tip='Like' onClick={this.likeScream}>
                        <FavoriteBorder color="primary" />
                    </CustomButton>
                );
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
                    {likeButton}
                        <span>{likeCount} Likes</span>
                        <CustomButton tip="Comment">
                            <ChatIcon color="primary" />
                        </CustomButton>
                        <span>{commentCount} comments</span>
                </CardContent>
            </Card>
        )
    }
}

Screams.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}


const mapStateToProps = state => ({
    user: state.user
});

const mapActionsToProps = {
    likeScream,
    unlikeScream
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Screams));
