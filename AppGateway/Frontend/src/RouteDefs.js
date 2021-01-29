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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function RouteDefs() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route path="/" render={(history) => (
            <AppBar position="static">
              <Tabs
                value={history.location.pathname}
              >
                <Tab
                  value={"/"}
                  label="Home"
                  component={Link}
                  to={"/"}
                />
                <Tab
                  value={"/login"}
                  label="Login"
                  component={Link}
                  to={"/login"}
                />
                <Tab
                  value={"/protected"}
                  label="Personenverwaltung"
                  component={Link}
                  to={"/protected"}
                />
              </Tabs>
            </AppBar>
          )} />
          <AuthButton />
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
    </AuthProvider >
  );
}
const Home = () => {
  return (
    <h2>Willkommen zum Verwaltungstool</h2>
  )
}

export default RouteDefs;
