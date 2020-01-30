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
        <Toolbar className="nav-container">
          {/* When the user is logged in, they'll be prompted with these options */}
          <Grid container alignItems="center">
            <img
              src={sixGod}
              alt="6 mans"
              style={{
                borderRight: "0.1px solid black",
                height: "20px",
                padding: "5px 10px 5px 0"
              }}
            />
            <Divider orientation="vertical" />
            <Typography style={{ paddingLeft: "10px" }}>Wagwan</Typography>
          </Grid>
          {authenticated ? ( // if user is authenticated
            <Fragment>
              <PostScream id="postScreamTest" />

              <Link to="/">
                <CustomBotton tip="Home">
                  <HomeIcon />
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
