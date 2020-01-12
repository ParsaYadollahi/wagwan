import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    ...theme.spreadThis,
});

class Comments extends Component {
    render() {
        const { comments, classes } = this.props; // destructure
        return (
            <Grid container>
                {/* Loop the number of comment times and return each of the comment */}
                {comments.map((comment, index) => {
                const {
                    body,
                    createdAt,
                    userImage,
                    userHandle
                } = comment;
                    return ( // returning this in the html
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container>
                                    {/* Image for comments section */}
                                    <Grid item sm={2}>
                                        <img src={userImage} alt="comment" className={classes.commentImage}/>
                                    </Grid>
                                    <Grid item sm={9}>
                                        {/* Name */}
                                        <div className={classes.commentData}>
                                            <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary">
                                                    {userHandle}
                                            </Typography>
                                            {/* Time */}
                                            <Typography variant="body2" color="textSecondary">
                                                    {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                            <hr className={classes.invisibleSep} />
                                            {/* Comment */}
                                            <Typography variant="body1">{body}</Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {index !== comments.length -1 && ( // Dont add line below last comment
                                <hr className={classes.visibleSep} />
                            )}
                        </Fragment>
                    )
                })}
            </Grid>
        )
    }

}

Comments.propTypes = {
    comments: PropTypes.array.isRequired
};

export default withStyles(styles)(Comments);
