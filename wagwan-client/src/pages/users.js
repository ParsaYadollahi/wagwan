import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import Screams from '../components/Scream/Screams';
import Grid from '@material-ui/core/Grid';
import StaticProfile from '../components/Profile/StaticProfile';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';


class users extends Component {
    state = {
        profile: null
    }
    componentDidMount() {
        const handle = this.props.match.params.handle; // Get handle from URL ('/user/:handle')
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch(err => console.log(err));

    }
    render() {
        const { screams, loading } = this.props.data;

        const screamsMarkup = loading ? (
            <p>Loading data...</p>
        ) : screams === null ? ( // Havent posted anything
            <p>No screams from the user</p>
        ) :(
            screams.map(scream => <Screams key={scream.screamID} scream={scream} />)
        )
        return (
            <Grid container spacing={3}>
            <Grid item sm={8} xs={12}>
                {screamsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                {this.state.profile === null ? (
                    <p>Loading Profile...</p>
                ) :  (
                    <StaticProfile profile={this.state.profile} />
                )}
            </Grid>
        </Grid>
        )
    }
}

users.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, {getUserData})(users);
