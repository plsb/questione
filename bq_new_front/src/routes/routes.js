import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { RouteWithLayout } from './../components';
import { Main as MainLayout, Minimal as MinimalLayout } from './../layouts';

import {
    SignUp as SignUpView,
    SignIn as SignInView,
} from '../pages';
//importar as paginas
import Login from '../components/Login';
import Home from '../pages/Professor/Home';
import ListCurso from '../pages/Professor/ListCurso';
import AdmLogin from '../pages/Administrador/AdmLogin';
import AdmHome from '../pages/Administrador/AdmHome';


const Routes = () => (
  <BrowserRouter>
    <Switch>
      <RouteWithLayout
          component={Home}
          exact
          layout={MainLayout}
          path="/home"
      />
        <RouteWithLayout
            component={SignUpView}
            exact
            layout={MinimalLayout}
            path="/sign-up"
        />
        <RouteWithLayout
            component={SignInView}
            exact
            layout={MinimalLayout}
            path="/sign-in"
        />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
