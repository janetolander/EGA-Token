import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import '../index.scss'
import '../assets/css/common.css';

// We use Route in order to define the different routes of our application

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "../private-route/PrivateRoute";
import { Provider } from "react-redux";
import store from "../store/store";
import jwt_decode from "jwt-decode";
// We import all the components we need in our app

import Signin from "../components/auth/signin";
import Signup from "../components/auth/signup";
import ForgotPassword from "../components/auth/forgotPassword";
import TokenBuy from "./tokenBuy/tokenbuying";
import TokenSell from "./tokenSell/tokensell";
import TokenSwap from "./tokenSwap/tokenswap";
import TokenSend from "./tokenSend/tokensend";
import Wallet from "./wallet/wallet";
import Profile from "./profile/profile";
import setAuthToken from "../utils/setAuthToken";

import Home from "./home/home";

import { setCurrentUser, logoutUser } from "../actions/authActions";
import { getTotalInfo } from "../actions/tokenActions";
import { getCurrentPrice } from "../actions/tokenPriceActions";
import { getCurrentAuthorize } from "../actions/authorizeActions";


if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  store.dispatch(getCurrentAuthorize(decoded.id))
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      window.location.href = "/signin";
  }
}

setInterval(() => {
  if(localStorage.jwtToken){
    store.dispatch(getTotalInfo());
    store.dispatch(getCurrentPrice());    
  }
}, 6000);

function Pages  ()  {
  
  return (
    <Provider store={store}>
      <Router>
        <Switch>
            <Route exact path="/">
              <Signin />
            </Route>
            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route exact path="/signin">
              <Signin />
            </Route>
            <Route exact path="/forgot">
              <ForgotPassword />
            </Route>
            <Switch>
                <PrivateRoute exact path="/home">
                  <Home />
                </PrivateRoute>
                <PrivateRoute exact path="/tokenbuy">
                  <TokenBuy />
                </PrivateRoute>
                <PrivateRoute exact path="/tokensell">
                  <TokenSell />
                </PrivateRoute>
                <PrivateRoute exact path="/tokenswap">
                  <TokenSwap />
                </PrivateRoute>
                <PrivateRoute exact path="/tokensend">
                  <TokenSend />
                </PrivateRoute>
                <PrivateRoute exact path="/wallet">
                  <Wallet />
                </PrivateRoute>
                <PrivateRoute exact path="/profile">
                  <Profile />
                </PrivateRoute>
            </Switch>
            
        </Switch> 
      </Router>
    </Provider>
  );
};

export default Pages;
