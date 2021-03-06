import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import blankMans from '../images/blank_mans.png';

// MUI
import Paper from '@material-ui/core/Paper';
// Icons
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

const styles = theme => ({
    ...theme.spreadThis,
    handle: {
        height: 20,
        backgroundColor: theme.palette.primary.main,
        width: 60,
        margin: '0px auto 7px auto',
    },
    fullLine: {
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: '100%',
        marginBottom: 10,
    },
    halfLine: {
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: '50%',
        marginBottom: 10,
    }
});

const ProfileSkeleton = (props) => {
    const { classes } = props;
    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                {/* Profile Image */}
                <div className="image-wrapper">
                    <img src={blankMans} alt="profile" className="profile-image" />
                </div>
                    <hr />
                    {/* Profile details */}
                <div className="profile-details">
                    {/* Empty full line */}
                    <div className={classes.handle} />
                        <hr />
                    {/* Empty half line */}
                    <div className={classes.fullLine} />
                    <div className={classes.fullLine} />
                        <hr />
                    {/* Location */}
                    <LocationOnIcon color='primary' />
                    <span>Location</span>
                        <hr />
                    {/* Website */}
                    <LinkIcon color='primary' /> https://website.com
                        <hr />
                    {/* Calendar */}
                    <CalendarTodayIcon color="primary" /> Joined Date
                </div>
            </div>
        </Paper>
    );
};

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSkeleton);
