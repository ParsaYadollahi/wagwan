import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    ...theme.spreadThis
});

class Comments extends Component {
    render(){
        const { comments, classes } = this.props;
        return (
            <Grid container>
                {/* Loop thru each of the comments */}
                {comments.map((comment) => {
                    const { body ,createdAt, userImage, userHandle} = comment;
                    return (
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <im src={userImage} alt="comment" className={classes.commentImage} />
                                    </Grid>
                                    <Grid item sm={9}>
                                        <div className={classes.commentData}>
                                            <Typography
                                                variant="h5"
                                                component={Link}
                                                to={`/users/${userHandle}`}
                                                color="primary">
                                                    {userHandle}
                                            </Typography>
                                            <Typography variant="body2" color="secondary">
                                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                            <hr className={classes.invisibleSep} />
                                            <Typography variant="body1">{body}</Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <hr className={classes.visibleSep} />
                        </Fragment>
                    )
                })}
            </Grid>
        )
    }

}

Comments.propTypes = {
    comments: PropTypes.array.isRequired
}


export default withStyles(styles)(Comments);
