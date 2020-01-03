import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; // Prop types (type checking)
import sixGod from '../images/6-god.png'
import axios from 'axios'

// MUI tings
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import theme from '../util/theme';

const styles = theme => ({
    ...theme.spreadThis
});



class signup extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            loading: false,
            errors: {}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        }
        axios.post('/signup', newUserData)
            .then(response => {
                console.log(response.data);
                localStorage.setItem('FBIdToken', `Bearer ${response.data.token}`);
                this.setState({ loading: false });
                this.props.history.push('/'); // push state in url and go to it (redirect to home page)
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                })
            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { classes } = this.props; // destructutre
        const { errors, loading } = this.state;
        const Link = require("react-router-dom").Link;
        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={sixGod} alt="6 mans" className={classes.image} />
                    <Typography variant="h2" className={classes.pageTitle}>
                         Sign Up
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            id="email"
                            name="email"
                            type="mail"
                            label="Email"
                            className={classes.TextField}
                            helperText={errors.email} // Display the errors
                            error={ errors.email ? true : false }
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth />
                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            className={classes.TextField}
                            helperText={errors.password} // Display the errors
                            error={ errors.password ? true : false }
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth />
                        <TextField
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            className={classes.TextField}
                            helperText={errors.confirmPassword} // Display the errors
                            error={ errors.confirmPassword ? true : false }
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            fullWidth />
                        <TextField
                            id="handle"
                            name="handle"
                            type="text"
                            label="Handle"
                            className={classes.TextField}
                            helperText={errors.handle} // Display the errors
                            error={ errors.handle ? true : false }
                            value={this.state.handle}
                            onChange={this.handleChange}
                            fullWidth />
                        {errors.general && (
                            <Typography variant="body2" className={classes.LoginError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={loading}>
                                Sign Up
                                {loading &&
                                    <CircularProgress size={30} className={classes.loading} />}
                        </Button>
                        <br />
                        <small>
                            Have an account? Login <Link to="/signup">Here</Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        );
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(signup);
