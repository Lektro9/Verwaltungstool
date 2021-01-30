import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './components/AuthProvider';
import { AuthButton } from './components/AuthButton';
import { PrivateRoute } from './components/PrivateRoute';
import { PersonenVeraltungsPage } from './pages/PersonenVerwaltung/PersonenVerwaltungsPage';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { MannschaftsVerwaltungsPage } from './pages/MannschaftsVerwaltung/MannschaftsVerwaltungsPage';
import { PersProvider } from './components/PersProvider';
import { MannProvider } from './components/MannProvider';

function RouteDefs() {
  return (
    <AuthProvider>
      <PersProvider>
        <MannProvider>
          <Router>
            <div>
              <Route
                path='/'
                render={(history) => (
                  <AppBar position='static'>
                    <Tabs value={history.location.pathname}>
                      <Tab value={'/'} label='Home' component={Link} to={'/'} />
                      <Tab
                        value={'/login'}
                        label='Login'
                        component={Link}
                        to={'/login'}
                      />
                      <Tab
                        value={'/perVerw'}
                        label='Personenverwaltung'
                        component={Link}
                        to={'/perVerw'}
                      />
                      <Tab
                        value={'/mannVerw'}
                        label='Mannschaftsverwaltung'
                        component={Link}
                        to={'/mannVerw'}
                      />
                    </Tabs>
                  </AppBar>
                )}
              />
              <AuthButton />
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <Route path='/login'>
                  <LoginPage />
                </Route>
                <PrivateRoute path='/perVerw'>
                  <PersonenVeraltungsPage />
                </PrivateRoute>

                <PrivateRoute path='/mannVerw'>
                  <MannschaftsVerwaltungsPage />
                </PrivateRoute>

                <Route path='/'>
                  <Home />
                </Route>
              </Switch>
            </div>
          </Router>
        </MannProvider>
      </PersProvider>
    </AuthProvider>
  );
}
const Home = () => {
  return <h2>Willkommen zum Verwaltungstool</h2>;
};

export default RouteDefs;
