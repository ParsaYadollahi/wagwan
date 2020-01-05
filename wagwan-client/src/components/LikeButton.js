import React, { Component } from 'react'
import CustomButton from '../util/CustomBotton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// import { connect } from 'react-redux'
import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../redux/actions/dataActions';

export class LikeButton extends Component {

    likedScream = () => {
        // Check if theres a likes in user object
        if (this.props.user.likes &&
            this.props.user.likes.find(
                like => like.screamId === this.props.screamId)) {
            return true;
        } else {
            return false;
        }
    };

    likeScream = () => {
        this.props.likeScream(this.props.screamId);
      };
    unlikeScream = () => {
        this.props.unlikeScream(this.props.screamId);
    };

    render() {
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? ( // Not logged in
            <Link to='/login'>
                <CustomButton tip='Like'>
                    <FavoriteBorder color="primary" />
                </CustomButton>
            </Link>
        ) : this.likedScream() ? ( // If returns true, means its present in the array (If user is logged in)
                <CustomButton tip='Unlike' onClick={this.unlikeScream}>
                    <FavoriteIcon color="primary" />
                </CustomButton>
            ) : (
                <CustomButton tip='Like' onClick={this.likeScream}>
                    <FavoriteBorder color="primary" />
                </CustomButton>
            );
        return likeButton
    }
}

LikeButton.propTypes = {
    user:PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likeScream,
    unlikeScream
}


export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
