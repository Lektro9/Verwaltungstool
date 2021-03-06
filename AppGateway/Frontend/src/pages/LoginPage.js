import { useState, useContext } from 'react'
import { Container, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const REACT_APP_ZUGRIFF = process.env.REACT_APP_ZUGRIFF || 'http://localhost:3005/api/zugriffsverwaltung'


const LoginPage = () => {
    const { state } = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();
    const authState = useContext(useAuth);

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(REACT_APP_ZUGRIFF)
        axios.post(REACT_APP_ZUGRIFF + '/login', { login: username, password: password }, { withCredentials: true }).then(function (response) {
            if (response.data.accessToken) {
                setMessage();
                authState.setAccessToken(response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken; // for all requests
            } else {
                setMessage(response);
            }
            console.log(response);
        }).catch(function (error) {
            setMessage(error.message);
            console.log(error);
        })
    }

    // when somebody is logged in, always get him back where he came from or to home
    if (authState.accessToken) {
        return <Redirect to={state?.from || '/'} />
    }

    return (
        <div className="App">
            <h1>Verwaltungstool</h1>
            <Container component="main" maxWidth="xs" onSubmit={handleSubmit}>
                <form noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        onInput={e => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onInput={e => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Log In
                        </Button>
                </form>
                <p>{JSON.stringify(message)}</p>
            </Container>
        </div>
    )
}

export default LoginPage