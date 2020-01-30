import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import CustomBotton from "../../util/CustomBotton";
import PostScream from "../Scream/PostScream";
import Notifications from "./Notifications";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import sixGod from "../../images/6-god.png";

// MUI tings
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import { Typography, Grid } from "@material-ui/core";

export class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        {/* Use toolbar because its inline - one after the other */}
        <Toolbar>
          {/* When the user is logged in, they'll be prompted with these options */}
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            style={{ width: "80%" }}
          >
            <Fragment>
              <Link to="/" style={{ textDecoration: "none", color: "#000000" }}>
                <img
                  src={sixGod}
                  alt="6 mans"
                  style={{
                    borderRight: "0.1px solid black",
                    height: "20px",
                    padding: "5px 12px 5px 0"
                  }}
                />
              </Link>
              <Link to="/" style={{ textDecoration: "none", color: "#000000" }}>
                <Typography style={{ marginLeft: "10px" }}>Wagwan</Typography>
              </Link>
            </Fragment>
          </Grid>

          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            {authenticated ? ( // if user is authenticated
              <Fragment>
                <PostScream id="postScream" />

                <Link to="/">
                  <CustomBotton tip="Home">
                    <HomeIcon style={{ color: "#FFFFFF" }} />
                  </CustomBotton>
                </Link>

                <Notifications />
              </Fragment>
            ) : (
              // When user is offline, they'll be prompted with these options
              <Fragment>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </Fragment>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool // Not required since user might not be authenticated
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
