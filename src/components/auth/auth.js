import React, { useState } from "react";

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

// We import all the components we need in our app

import Signin from "./signin";
import Signup from "./signup";

function Auth  ({setToken})  {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  return (
    <div>
      <Route exact path="/signin">
        <Signin setToken={setToken}/>
      </Route>
      
      <Route path="/signup">
        <Signup setToken={setToken}/>
      </Route>
      {/* <Signin setToken={setToken}/> */}
    </div>
  );
};

export default Auth;
