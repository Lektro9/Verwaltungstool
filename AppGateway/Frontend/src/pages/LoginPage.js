import { useState, useContext } from 'react'
import { Container, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const URL = 'http://localhost:3005/login'

const LoginPage = () => {
    const { state } = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();
    const authState = useContext(useAuth);

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(URL, { login: username, password: password }, { withCredentials: true }).then(function (response) {
            if (response.data.accessToken) {
                setMessage();
                authState.setAccessToken(response.data.accessToken);

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
                <p>{JSON.stringify(authState)}</p>
            </Container>
        </div>
    )
}

export default LoginPage