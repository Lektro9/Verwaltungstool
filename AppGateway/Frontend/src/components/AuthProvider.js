import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Axios from 'axios';

export const AuthProvider = (props) => {
  // check if refreshToken is in httponly cookie
  // you will receive a new AccessToken when cookie is set
  // else you have to login again

  useEffect(() => {
    Axios.get('http://localhost:3005/token', { withCredentials: true })
      .then(function (response) {
        console.log(response);
        setAccessToken(response.data.accessToken);
      })
      .catch(function (error) {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setAccessToken = (accessToken) => {
    setState({ ...state, accessToken: accessToken });
  };

  const initState = {
    accessToken: '',
    setAccessToken: setAccessToken,
  };

  const [state, setState] = useState(initState);

  return <useAuth.Provider value={state}>{props.children}</useAuth.Provider>;
};
