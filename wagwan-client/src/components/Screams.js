import React, { Component } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

// MUI tings
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography"

const styles = {
    card: {
        marginBottom: 20,
        display: 'flex'
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};


class Screams extends Component {
    render() {
        const Link = require("react-router-dom").Link;
        const { classes,
            scream : {
                body,
                createdAt,
                userImage,
                userHandle,
                screamId,
                likeCount,
                commentCount
            }} = this.props // destrcuture classes
        return (
            <Card className={classes.card}>
                <CardMedia
                image={userImage}
                title="Profile image" className={classes.image}/>
                <CardContent class={classes.content}>
                    <Typography
                    variant="h5"
                    component={Link}
                    to={`/users/${userHandle}`}
                    color='inherit'>
                        {userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">{createdAt}</Typography>
                    <Typography variant="body1">{body}</Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(Screams)
