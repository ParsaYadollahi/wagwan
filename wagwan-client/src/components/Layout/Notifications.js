import React, { Component, Fragment } from 'react';
import dayjs from 'dayjs' // format the date
import relativeTime from 'dayjs/plugin/relativeTime' // relative time lib
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// MUI tings
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/ToolTip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

// Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

class Notifications extends Component {
    state = {
        anchorEl: null
    }

    handleOpen= (e) => {
        this.setState({
            anchorEl: e.target // menu = object
        });
    }

    // Handle closing the notifications tab
    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    // Handle opening the notifications tab
    onMenuOpened = () => {
        // Get the unread notification IDs
        let unreadNotificationsId = this.props.notifications
            .filter(not => !not.read) // Only add the elements that have not been read to the array (filter)
            .map(not => not.notificationsId);
        this.props.markNotificationsRead(unreadNotificationsId); // send the ID to post req to make it as read = true
    }

    render() {
        const notifications = this.props.notifications; // notification object
        const anchorEl = this.state.anchorEl;

        dayjs.extend(relativeTime)

        let notificationsIcon;
        // Change notification deping on comment or like9
        if (notifications && notifications.length > 0){
            // show the number of nots
            notifications.filter(not => not.read === false).length > 0 // filter the nonread notifications
            ? (notificationsIcon = (

                <Badge badgeContent={notifications.filter(not => not.read === false).length} // Indicate the number of non read notifications
                    color='secondary'>
                        <NotificationsIcon />
                </Badge>

            )) : (
                notificationsIcon = <NotificationsIcon /> // An empty notification if there no new nots
            )
        } else {
            notificationsIcon = <NotificationsIcon /> // An empty notification if there no new nots
        }

        let notificationsMarkUp =
            notifications && notifications.length > 0 ?(
                // map thru nots and show em
                notifications.map((not) => { // Mapping "not" to each of these elements ==> not object = all elements of notification

                    const verb = not.type === 'like' ? 'liked' : 'commented on'; // Verb if its a comment of a like
                    const time = dayjs(not.createdAt).fromNow();
                    const iconColor = not.read ? 'primary' : 'secondary'; // if read, mark diff colors
                    const icon = not.type === 'like' ? (

                        <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} /> // Like icon
                    ) : (
                        <ChatIcon color={iconColor} style= {{ marginRight: 10 }} /> // Comment icon
                    );
                    return (
                        // List all the notifications
                        <MenuItem key={Math.random()} onClick={this.handleClose}>
                            {icon}
                            <Typography
                                component={Link}
                                color='secondary'
                                variant='body1'
                                to={`/users/${not.recipient}/scream/${not.screamId}`}>
                                    {not.sender} {verb} ya post {time}
                                </Typography>
                        </MenuItem>
                    )
                })
            ) : (
                <MenuItem onClick={this.handleClose}>
                     Ya got no notifications ya bum
                </MenuItem>
            )
        return (

            <Fragment>
                <Tooltip placement="top" title='Notifications'>
                    <IconButton aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleOpen}>
                            {notificationsIcon}
                        </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    onEntered={this.onMenuOpened}>
                        {notificationsMarkUp}
                    </Menu>
            </Fragment>

        )
    }
}

Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired, // post req to mark as read
    notifications: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    notifications: state.user.notifications
})

export default connect(mapStateToProps, { markNotificationsRead })(Notifications);
