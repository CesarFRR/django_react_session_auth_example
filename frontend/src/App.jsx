import React, { useState, useEffect } from "react";
import { login, logout } from "./api/accounts.api";
import { UNPetAxios } from "./api/config";
const BASE_URL =  "https://api-django-react-cookies-j252.onrender.com/api"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Posts from "./CreatePost"
import Login from "./Login"
import {Navigate } from "react-router-dom";
const App = () => {
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

  const handleLogout = async () => {
    const response = await logout()
    if (response.isAuthenticated === false) {
      setIsAuthenticated(false);
    } else {

      console.log('error en logout: '.response);
    };
  }


  return (


    <BrowserRouter>
      <Routes>

        <Route path="/posts" element={<Posts/>} />
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
      </Routes>

    </BrowserRouter>

        
  );
}

export default App;