import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import Screams from '../components/Scream/Screams';
import Grid from '@material-ui/core/Grid';
import StaticProfile from '../components/Profile/StaticProfile';
import Scream from '../components/Scream/Screams';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

import ScreamSkeleton from '../util/ScreamSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

class users extends Component {
    state = {
        profile: null,
        screamIdParam: null
    }
    componentDidMount() {
        const handle = this.props.match.params.handle; // Get handle from URL ('/user/:handle')
        const screamId = this.props.match.params.screamId;

        if (screamId) {
            this.setState({ screamIdParam: screamId })
        }


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
        const { screamIdParam } = this.state;

        const screamsMarkup = loading ? (
            <ScreamSkeleton />
        ) : screams === null ? ( // Havent posted anything
            <p>No screams from the user</p>
        ) : !screamIdParam  ? (
            screams.map(scream => <Screams key={scream.screamId} scream={scream} />)
        ) : ( // trying to visit scream
            screams.map(scream => {
                if (scream.screamId !== screamIdParam) {
                    return <Scream key={scream.screamId} scream={scream} />
                } else {
                    return <Scream key={scream.screamId} scream={scream} openDialog />
                }
            })
        )
        return (
            <Grid container spacing={3}>
            <Grid item sm={8} xs={12}>
                {screamsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                {this.state.profile === null ? (
                    <ProfileSkeleton />
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