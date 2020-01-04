import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CustomButton from '../util/CustomBotton';

// Redux tings
import { connect } from 'react-redux';
import { postScream } from '../redux/actions/dataActions';

// MUI tings
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';


const styles = theme => ({
    ...theme.spreadThis,
    submitButton: {
        position: 'relative',
        margin: '10px auto 5px auto',
        float: "right"
    },
    progrssSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '92%',
        top: '3%'
    }
});


class PostScream extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        };
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ body: '' }); // remove the text when submitted
            this.handleClose(); // close the box when
        }
    }
    handleOpen = () => {
        this.setState({ open: true })
    };
    handleClose = () => {
        this.setState({ open: false, errors: '' }) // Clear the errors once closed
    };
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.postScream({ body: this.state.body })
    };
    render(){
        const { errors } = this.state;
        const { classes, UI: { loading }} = this.props;
        return (
            <Fragment>
                <CustomButton onClick={this.handleOpen} tip="Make a Post">
                    <AddIcon />
                </CustomButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    minWidth='sm'>
                        <CustomButton
                            tip='Close'
                            onClick={this.handleClose}
                            tipClassName={classes.closeButton}>
                                <CloseIcon />
                        </CustomButton>
                        <DialogContent>
                            <DialogTitle style={{ paddingLeft: "0px" }}>What's on your mind?</DialogTitle>
                            <form onSubmit={this.handleSubmit}>
                                <TextField
                                    name='body'
                                    type="text"
                                    label="Post"
                                    multiline
                                    rows="3"
                                    placeholder="Spill the beans"
                                    error={errors.body ? true : false} // errors in the validation
                                    helperText= {errors.body} // show error message
                                    className={classes.textField}
                                    onChange={this.handleChange}
                                    fullWidth/>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        className={classes.submitButton}
                                        disabled={loading}>
                                            Submit
                                            {loading && (
                                                <CircularProgress
                                                    size={30}
                                                    className={classes.progrssSpinner} />
                                            )}
                                    </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
            </Fragment>
        )
    }
}


PostScream.Prototype = {
    postScream: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps, { postScream })(withStyles(styles)(PostScream));
