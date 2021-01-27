import { useState, useContext } from 'react'
import { Container, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const URL = 'http://localhost:3005/login'
const URLData = 'http://localhost:3005/getData'
let accessToken = ""

const LoginPage = () => {
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const { state } = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();
    const authState = useContext(useAuth);

    if (redirectToReferrer === true) {
        return <Redirect to={state?.from || '/'} />
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(URL, { login: username, password: password }, { withCredentials: true }).then(function (response) {
            if (response.data.accessToken) {
                accessToken = response.data.accessToken;
                setMessage();
                authState.setIsAuthenticated(true)
                setRedirectToReferrer(true);

            } else {
                setMessage(response);
            }
            console.log(response);
        }).catch(function (error) {
            setMessage(error.message);
            console.log(error);
        })
    }
    const getMyData = (e) => {
        axios.get(URLData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((response) => console.log(response))
            .catch(function (error) {
                console.log(error);
            })
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
                <Button
                    fullWidth
                    style={{ marginTop: 10 }}
                    variant="contained"
                    color="primary"
                    onClick={getMyData}
                >
                    MyData
                    </Button>
                <p>{JSON.stringify(message)}</p>
                <p>{JSON.stringify(authState)}</p>
            </Container>
        </div>
    )
}

export default LoginPage