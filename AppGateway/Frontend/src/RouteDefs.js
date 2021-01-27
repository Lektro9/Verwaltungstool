import { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./components/AuthProvider"



const AuthButton = () => {
  const authState = useContext(useAuth);
  const history = useHistory();
  return authState.isAuthenticated === true
    ?
    <p>
      <button onClick={() => {
        authState.setIsAuthenticated(false);
        history.push('/');
      }}>sign out</button>
    </p>
    :
    <p>
      You are not logged in!
    </p>
}

const PrivateRoute = ({ children, ...rest }) => {
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

function RouteDefs() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <AuthButton />
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to="/login">Login</Link>
          </div>
          <div>
            <Link to="/protected">Protected</Link>
          </div>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>

            <Route path="/login">
              <LoginPage />
            </Route>
            <PrivateRoute path="/protected">
              <Private />
            </PrivateRoute>
            <Route path="/">
              <Home />
            </Route>

          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}
const Home = () => {
  return (
    <div>home</div>
  )
}

const Private = () => {
  return (
    <div>Private Content</div>
  )
}

export default RouteDefs;
