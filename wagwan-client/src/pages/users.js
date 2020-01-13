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
    state = { // Data
        profile: null,
        screamIdParam: null
    };
    componentDidMount() {
        const handle = this.props.match.params.handle; // Get handle from URL ('/user/:handle')
        const screamId = this.props.match.params.screamId; // Get screamId from URL
        if (screamId) { // If we get a screamId, set it to paramss
            this.setState({ screamIdParam: screamId })
        };
        this.props.getUserData(handle);

        axios.get(`/user/${handle}`) // getUserDetails
            .then(res => {
                this.setState({
                    profile: res.data.user // Add the response data into profile
                })
            })
            .catch(err => console.log(err));

    };
    render() {
        const { screams, loading } = this.props.data;
        const { screamIdParam } = this.state;

        const screamsMarkup = loading ? (
            <ScreamSkeleton /> // If loading, display the skeleton
            // Havent posted anything
        ) : screams === null ? (
            <p>This mans hasn't posted anything yet</p>
            // H
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
        );
        return (
            <Grid container spacing={3}>
                <Grid item sm={8} xs={12}>
                    {screamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <ProfileSkeleton /> // If there are no profiles ==> load skeleton
                    ) :  (
                        <StaticProfile profile={this.state.profile} /> // load the profiles
                    )}
                </Grid>
            </Grid>
            );
        };
    };

users.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {getUserData})(users);
