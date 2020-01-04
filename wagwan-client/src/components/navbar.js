import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import CustomBotton from '../util/CustomBotton'
import PostScream from './PostScream';

// MUI tings
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { Tooltip, IconButton, Icon } from '@material-ui/core';

// Icons
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';


export class navbar extends Component {
    render() {
        const authenticated = this.props
        const Link = require("react-router-dom").Link; // New import??
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <PostScream />
                            <CustomBotton tip="Home" component={Link} to="/" >
                                <HomeIcon/>
                            </CustomBotton>
                            <CustomBotton tip="Notifications">
                                <NotificationsIcon />
                            </CustomBotton>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button color='inherit' component={Link} to="/login">Login</Button>
                            <Button color='inherit' component={Link} to="/">Home</Button>
                            <Button color='inherit' component={Link} to="/signup">Sign Up</Button>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}

navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    authenticated: state.user.authenticated
})

export default navbar
