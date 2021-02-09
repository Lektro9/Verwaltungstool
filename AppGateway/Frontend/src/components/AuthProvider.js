import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};


export const AuthProvider = (props) => {
  // check if refreshToken is in httponly cookie
  // you will receive a new AccessToken when cookie is set
  // else you have to login again

  useEffect(() => {
    axios.get('http://localhost:3005/token', { withCredentials: true })
      .then(function (response) {
        setAccessToken(response.data.accessToken);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken; // for all requests
      })
      .catch(function (error) {
        console.log(error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setAccessToken = (accessToken) => {
    if (accessToken) {
      setState({ ...state, accessToken: accessToken, user: parseJwt(accessToken) });
    } else {
      setState({ ...state, accessToken: accessToken, user: {} });
    }
  };

  const initState = {
    accessToken: '',
    user: {},
    setAccessToken: setAccessToken,
  };

  const [state, setState] = useState(initState);

  return <useAuth.Provider value={state}>{props.children}</useAuth.Provider>;
};
