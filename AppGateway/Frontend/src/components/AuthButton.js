import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AuthButton = () => {
    const authState = useContext(useAuth);
    const history = useHistory();
    return authState.accessToken
        ?
        <p>
            <button onClick={() => {
                authState.setAccessToken("");
                history.push('/');
            }}>sign out</button>
        </p>
        :
        <p>
            You are not logged in!
      </p>
}
