import { Container, Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { useState } from 'react'

const URL = 'http://localhost:3005/login'
const URLData = 'http://localhost:3005/getData'
let accessToken = ""

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(URL, { username: username, password: password }).then(function (response) {
            accessToken = response.data.accessToken
            console.log(response);
        }).catch(function (error) {
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
            </Container>
        </div>
    )
}

export default LoginPage