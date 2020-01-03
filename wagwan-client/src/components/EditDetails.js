import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CustomButton from '../util/CustomBotton';

// Redux tings
import { connect } from 'react-redux';
import { editUserData } from '../redux/actions/userActions';

// MUI tings
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';

// Icon
import EditIcon from '@material-ui/icons/Edit'


const styles = theme => ({
    ...theme.spreadThis,
    button: {
        float: "right"
    }
});

class EditDetails extends Component {
    state = {
        bio: '',
        website: '',
        location: '',
        open: false // Dialogue
    };

    mapUserDataToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        });
    };

    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDataToState(this.props.credentials);
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    componentDidMount(){
        const { credentials } = this.props;
        this.mapUserDataToState(credentials);

    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = () => {
        const userData = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        this.props.editUserData(userData);
        this.handleClose();
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <CustomButton tip="Edit Details" onClick={this.handleOpen} btnClassName={classes.button}>
                    <EditIcon color="primary" />
                </CustomButton>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm">
                        <DialogTitle>Edit Details</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField
                                    name='bio'
                                    type='text'
                                    label='Bio'
                                    multiline
                                    rows="3"
                                    placeholder="Gimme a bio"
                                    className={classes.TextField}
                                    value={this.state.bio}
                                    onChange={this.handleChange}
                                    fullWidth/>
                                <TextField
                                    name='website'
                                    type='text'
                                    label='Website'
                                    placeholder="Personal website"
                                    className={classes.TextField}
                                    value={this.state.website}
                                    onChange={this.handleChange}
                                    fullWidth/>
                                <TextField
                                    name='location'
                                    type='text'
                                    label='Location'
                                    placeholder="Toss the addy"
                                    className={classes.TextField}
                                    value={this.state.location}
                                    onChange={this.handleChange}
                                    fullWidth/>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleSubmit} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});

EditDetails.propTypes = {
    editUserData: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { editUserData })(withStyles(styles)(EditDetails));
