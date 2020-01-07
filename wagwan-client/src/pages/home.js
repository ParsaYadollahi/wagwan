import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Scream from '../components/Scream/Screams';
import Profile from '../components/Profile/Profile';
import ScreamSkeleton from '../util/ScreamSkeleton';

import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';

class home extends Component {
    componentDidMount() {
        this.props.getScreams();
    }
    render() {
        const { screams, loading } = this.props.data // from data

        let recentScreamsMarkup = !loading ? ( // If not loading, show screams
            screams.map((scream) =>
                <Scream key={scream.screamId} scream={scream}/>)
        ) : (
            <ScreamSkeleton />
        );
        return (
            <Grid container spacing={3}>
                <Grid item sm={8} xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        );
    }
}

home.propTypes = {
    getScreams: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({ // data reducer puts data in the obj
    data: state.data
})


export default connect(mapStateToProps, { getScreams })(home);
