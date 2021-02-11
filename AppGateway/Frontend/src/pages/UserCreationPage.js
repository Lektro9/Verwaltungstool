import { Button, Container, MenuItem, Select, TextField } from "@material-ui/core";
import axios from "axios";
import { useContext, useState } from "react"
import { useAuth } from "../hooks/useAuth"

const REACT_APP_ZUGRIFF = process.env.REACT_APP_ZUGRIFF || 'http://localhost:3005/api/zugriffsverwaltung'

export const UserCreationPage = () => {
    const authState = useContext(useAuth);
    const [username, setUsername] = useState(false)
    const [password, setPassword] = useState(false)
    const [message, setMessage] = useState("hey")
    const [role, setRole] = useState(0)

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(username, password, role)
        axios.post(REACT_APP_ZUGRIFF + '/user', { login: username, password: password, role }).then(function (response) {
            setMessage("User created!: " + JSON.stringify(response.data))
        }).catch(function (error) {
            setMessage(error.message);
            console.log(error);
        })
    }

    if (authState.user.role === 0) {
        return <div>Hier kann ein Admin Nutzer erstellen</div>
    }

    return (
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
                <Select
                    labelId='rolle'
                    id='simple-rolle'
                    defaultValue={role}
                    value={role}
                    onChange={(event) => { setRole(event.target.value) }}
                >
                    <MenuItem value={1}>Admin</MenuItem>
                    <MenuItem value={0}>User</MenuItem>
                </Select>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Nutzer erstellen
                </Button>
            </form>
            <p>{JSON.stringify(message)}</p>
        </Container>
    )
}