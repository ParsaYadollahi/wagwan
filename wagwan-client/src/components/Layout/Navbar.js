import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import CustomBotton from '../../util/CustomBotton'
import PostScream from '../Scream/PostScream';

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
import { Link } from 'react-router-dom';

export class Navbar extends Component {
    render() {
        const authenticated = this.props
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <PostScream />
                            <Link to="/">
                                <CustomBotton tip="Home">
                                    <HomeIcon />
                                </CustomBotton>
                            </Link>
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

Navbar.propTypes = {
    authenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    authenticated: state.user.authenticated
})

export default Navbar
