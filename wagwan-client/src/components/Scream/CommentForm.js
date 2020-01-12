import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// MUI tings
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

// Redux timgs
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis
});

class CommentForm extends Component {
    state = {
        body: '',
        errors: {}
    };

    getDerivedStateFromProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors})
        };
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                body: ''
            });
        };
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit  = (e) => {
        e.preventDefault(); // prevents either the buttong or input being clicked, only the form
        // Create a post request sending data to `/scream/${screamId}/comment`, commentData
        this.props.submitComment(this.props.screamId, { body: this.state.body });
    };

    render() {
        const { authenticated, classes } = this.props; // destructuring props
        const errors = this.state.errors;

        const commentFormMarkup = authenticated ? (
            // center align the comments
            <Grid item sm={12} style={{ textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name='body'
                        type='text'
                        label='Comment on Post'
                        error={ errors.comment ? true : false}
                        helperText={errors.comment}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                        className={classes.textField} />

                        <Button
                            type="submit"
                            variant="contained"
                            color='primary'
                            className={classes.button}>
                                Submit
                        </Button>

                </form>
                <hr className={classes.visibleSep} />
            </Grid>

        ) : null
        return commentFormMarkup; // return the comment
    };
};

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    UI: state.UI,
    authenticated: state.user.authenticated // dont wanna show form if not logged in
});

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));
