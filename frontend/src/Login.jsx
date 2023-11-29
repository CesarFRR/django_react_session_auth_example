import React, { useState, useEffect } from "react";
import {login, logout } from "./api/accounts.api";
import { UNPetAxios } from "./api/config";
const BASE_URL = "https://api-django-react-cookies-j252.onrender.com/api"
import { BrowserRouter, Route } from "react-router-dom";
import Posts from "./CreatePost"
const Login = () => {
  const [csrf, setCsrf] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  const whoami = () => {
    fetch(BASE_URL + "/accounts/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const isResponseOk = (response) => {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }
  const handleLogin = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await login(data);
    if (response.isAuthenticated) {
      setIsAuthenticated(true);
      setUsername("");
      setPassword("");
      setError("");
    } else {
      setError(response.error);
    }
  };

  const handleLogout = async() => {
    const response =  await logout()
    if (response.isAuthenticated===false) {
        setIsAuthenticated(false);
    } else {
      
        console.log('error en logout: '. response);
      };
  }


  return (
    <>


      {!isAuthenticated ?
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" name="username"  />
            </div>
            <div className="form-group">
              <label htmlFor="username">Password</label>
              <input type="password" className="form-control" id="password" name="password"  />
              <div>
                {error &&
                  <small className="text-danger">
                    {error}
                  </small>
                }
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
        :
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <p>You are logged in!</p>
          <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
          <button className="btn btn-danger" onClick={whoami}>Quien soy?</button>

        </div>

      }
    </>

  );
}

export default Login;