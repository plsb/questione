import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  //Redirect
} from 'react-router-dom';


//importar as paginas
import Login from '../components/Login';
import Home from '../pages/Professor/Home';
import ListCurso from '../pages/Professor/ListCurso';
import AdmLogin from '../pages/Administrador/AdmLogin';
import AdmHome from '../pages/Administrador/AdmHome';


const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Home" component={Home} />
      <Route exact path="/ListCurso" component={ListCurso} />
      <Route exact path="/Administrador/AdmLogin" component={AdmLogin} />
      <Route exact path="/Administrador/AdmHome" component={AdmHome} />
      



      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;