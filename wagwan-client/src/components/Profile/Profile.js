import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import CustomBotton from '../../util/CustomBotton';
import ProfileSkeleton from '../../util/ProfileSkeleton';

// MUI tings
import Button from '@material-ui/core/Button';
import Paper  from '@material-ui/core/Paper';
import MLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

// Redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../../redux/actions/userActions';

const styles = (theme) => ({
  ...theme.spreadThis,
  });



class Profile extends Component {
    handleImageChange = (e) => {
        const profilePic = e.target.files[0];
        // Sned image to server
        const formData = new FormData();
        formData.append('profilePic', profilePic, profilePic.name);
        this.props.uploadImage(formData);
    };
    handlePictureEdit = () => {
        const fileInput = document.getElementById('profile_image');
        fileInput.click();
    };
    handleLogout = () => {
      this.props.logoutUser();
    }
    render() {
        const {
            classes,
            user: {
                 credentials: { handle, createAt, imageUrl, bio, website, location },
                loading, // When profile loading, preivew loading skeleton
                authenticated
            }
        } = this.props

        let profileMarkup = !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image"/>
                        <input
                            type='file'
                            id='profile_image'
                            hidden='hidden'
                            onChange={this.handleImageChange}
                        />

                        <CustomBotton
                          tip='Edit Profile Picture'
                          onClick={this.handlePictureEdit}
                          btnClassName='button'>
                            <EditIcon color="primary"  />
                        </CustomBotton>

                    </div><hr />
                    <div className="profile-details">
            <MLink component={Link} to={`/users/${handle}`} color="primary" id='userHandleTest' variant="h5">
                @{handle}
            </MLink><hr />
            {bio && <Typography variant="body2">{bio}</Typography>}<hr />
            {location && (
                <Fragment>
                    <LocationOn color="primary"/> <span>{location}</span><hr />
                </Fragment>
            )}
            {website && (
                <Fragment>
                    <LinkIcon color="primary" />
                        <a href={website} target="_blank" rel="noopener noreferrer">
                            {' '}{website}
                        </a><hr />
                </Fragment>
            )}
            <CalendarTodayIcon color="primary" />{' '}
            <span>Joined {dayjs(createAt).format('MMM YYYY')}</span>
                    </div>

                <CustomBotton tip='Logout'
                          onClick={this.handleLogout}>
                            <KeyboardReturn id="logoutButton" color="primary"  />
                </CustomBotton>

                <EditDetails />
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body2" id="doneTesting" align="center" >
                    No profile Found, Try again
                </Typography>
                <div className={classes.buttons}>
                    <Button variant="contained" color="primary" id="beginLogin" component={Link} to='/login'>
                        Login
                    </Button>
                    <Button variant="contained" color="secondary" id="beginSignup" component={Link} to='/signup'>
                        Sign Up
                    </Button>
                </div>
            </Paper>
        )) : <ProfileSkeleton /> // Load the profile skeleton if everything fails (loading)

        return profileMarkup;
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    logoutUser,
    uploadImage
};

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
