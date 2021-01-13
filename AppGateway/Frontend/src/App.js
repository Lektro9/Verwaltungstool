import './App.css';
import { useState } from 'react'
import { Container, Button, TextField } from '@material-ui/core';
import axios from 'axios';

const URL = 'http://localhost:3005/login'

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(URL, { username: username, password: password }).then(function (response) {
      console.log(response);
    }).catch(function (error) {
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
      </Container>
    </div>
  );
}

export default App;
