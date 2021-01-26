
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";


export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    cb();
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100); //fake async
  }
}

const AuthButton = () => {
  const history = useHistory();
  return fakeAuth.isAuthenticated === true
    ?
    <p>
      <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>sign out</button>
    </p>
    :
    <p>
      You are not logged in!
    </p>
}

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest} render={({ location }) => {
      return fakeAuth.isAuthenticated === true
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
