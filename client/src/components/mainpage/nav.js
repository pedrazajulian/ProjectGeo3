import React from "react";
import { Link } from "react-router-dom";

import "./nav.css";

function Nav(props) {
  return (
    <div class="navbar-fixed">

<nav>
    <div class="nav-wrapper">
      <a href="#!" class="brand-logo">Logo</a>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
            <li onClick={props.manageLogin} style={{ cursor: "pointer" }}>
              <Link to={props.loggedIn === "true" ? "/" : "/loginpage"}>
                {props.loggedIn === "true" ? "Log Out" : "Log In"}
              </Link>
            </li>
            <li className={props.loggedIn === "true" ? "hiddenForNav" : ""}>
              <Link to="/signup">Sign Up!</Link>
            </li>
            <li className={props.loggedIn === "true" ? "" : "hiddenForNav"}>
              <Link to="/myevents">My Events</Link>
            </li>
            <li className={props.loggedIn === "true" ? "" : "hiddenForNav"}>
              <Link to="/myaccount">My Account</Link>
      </ul>
    </div>
  </nav>

  <ul class="sidenav" id="mobile-demo">
            <li onClick={props.manageLogin} style={{ cursor: "pointer" }}>
              <Link to={props.loggedIn === "true" ? "/" : "/loginpage"}>
                {props.loggedIn === "true" ? "Log Out" : "Log In"}
              </Link>
            </li>
            <li className={props.loggedIn === "true" ? "hiddenForNav" : ""}>
              <Link to="/signup">Sign Up!</Link>
            </li>
            <li className={props.loggedIn === "true" ? "" : "hiddenForNav"}>
              <Link to="/myevents">My Events</Link>
            </li>
            <li className={props.loggedIn === "true" ? "" : "hiddenForNav"}>
              <Link to="/myaccount">My Account</Link>
  </ul>
          
    </div>
  );
}

export default Nav;
