import React, { Fragment } from 'react';
import blankMans from '../images/blank_mans.png';
import PropTypes from 'prop-types';

// MUI tings
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    ...theme.spreadThis,
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    cardContent: {
        width: '100%',
        flexDirection: 'column', // so they stack on each other
        padding: 25
    },
    cover: {
        maxWidth: '22%',
    },
    handle: {
        width: 60,
        height: 18,
        backgroundColor: theme.palette.primary.main,
        marginBottom:10
    },
    image: {
        width: '100%',
        overflow: 'hidden',
    },
    date: {
        height: 15,
        width: 100,
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginBottom: 10

    },
    fullLine: {
        height:15,
        width: '90%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        marginBottom: 10
    },
    halfLine: {
        height:15,
        width: '50%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        marginBottom: 10
    }
});

const ScreamSkeleton = (props) => {
    const { classes } = props;

    const content = Array.from({ length: 5}).map((item, index) => ( // item not needed (max 5 empty bodys)
        <Card className={classes.card} key={index}>
            <CardMedia className={classes.cover}>
                <img src={blankMans} alt="blank mans" className={classes.image} />
            </CardMedia>
            <CardContent className={classes.cardContent}>
                <div className={classes.handle} />
                <div className={classes.date} />
                <div className={classes.fullLine} />
                <div className={classes.fullLine} />
                <div className={classes.halfLine} />
            </CardContent>
        </Card>
    ))

    return <Fragment>{content}</Fragment>
}

ScreamSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScreamSkeleton);
