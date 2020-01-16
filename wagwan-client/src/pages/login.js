import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; // Prop types (type checking)
import sixGod from '../images/6-god.png'
import { Link } from 'react-router-dom';

// MUI tings
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
// Redux tings
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions'

const styles = theme => ({
    ...theme.spreadThis,
});


class login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        };
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        };
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history); // redirects on success
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value // Change char per char
        });
    };

    render() {
        const { classes, UI: { loading } } = this.props; // destructutre
        const { errors } = this.state;
        return (
            <Grid container // outter grid to space in middle
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.form}>
                    {/* Inner grid for content */}
                    <Grid item sm={4}>
                        <img src={sixGod} alt="6 mans" className={classes.image} />
                        <Typography variant="h2" className={classes.pageTitle}>
                            Login
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
                                {/* Display errors */}
                            {errors.general && (
                                <Typography variant="body2" className={classes.LoginError}>
                                    {errors.general}
                                </Typography>
                            )}
                            {/* Submit button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                disabled={loading}
                                id="loginButtonLogin">
                                    Login
                                    {/* Loading circle when logging in */}
                                    {loading &&
                                        <CircularProgress size={30} className={classes.loading} />}
                            </Button>
                            <br />
                            <small>
                                Sign Up <Link to="/signup">Here</Link>
                            </small>
                            <Typography style={{marginTop: '1px'}}>
                                <Link style={{ fontSize: '14px' , color: '#1976d2' }} to="/reset">Reset Password</Link>
                            </Typography>
                        </form>
                    </Grid>

            </Grid>
        );
    };
};

login.propTypes = { // All added to props
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

// Props
const mapStateToProps = (state) => ({
    // Access objects from redux state
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
}; // what actions we're going to use

// export component that need access to change Redux state.
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
