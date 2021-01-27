import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./components/AuthProvider"
import { AuthButton } from "./components/AuthButton"
import { PrivateRoute } from "./components/PrivateRoute"
import { PersonenVeraltungsPage } from "./pages/PersonenVerwaltungsPage";

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
              <PersonenVeraltungsPage />
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
    <h2>Willkommen zum Verwaltungstool</h2>
  )
}

export default RouteDefs;
