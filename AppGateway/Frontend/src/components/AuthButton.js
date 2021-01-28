import Axios from "axios";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AuthButton = () => {
    const authState = useContext(useAuth);
    const history = useHistory();
    const logoutCall = () => {
        Axios.get("http://localhost:3005/logout", { withCredentials: true }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        })
    }
    return authState.accessToken
        ?
        <p>
            <button onClick={() => {
                authState.setAccessToken("");
                history.push('/');
                logoutCall();
            }}>sign out</button>
        </p>
        :
        <p>
            You are not logged in!
      </p>
}
