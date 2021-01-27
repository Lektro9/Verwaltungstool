import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const PrivateRoute = ({ children, ...rest }) => {
    const authState = useContext(useAuth);
    return (
        <Route {...rest} render={({ location }) => {
            return authState.isAuthenticated === true
                ? children
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: location }
                }} />
        }} />
    )
}