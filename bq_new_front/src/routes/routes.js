import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
    Redirect
} from 'react-router-dom';
import { RouteWithLayout } from './../components';
import { Main as MainLayout, Minimal as MinimalLayout } from './../layouts';

import {
    SignUp,
    SignIn,
    UserList,
    RedefinePassword,
    ResetPassword
} from '../pages';

const Routes = () => (
  <BrowserRouter>
    <Switch>
        <Redirect
            exact
            from="/"
            to="/home"
        />
        <RouteWithLayout
            component={UserList}
            exact
            needToBeLogged={true}
            layout={MainLayout}
            path="/users"/>
        <RouteWithLayout
          component={UserList}
          exact
          needToBeLogged={true}
          layout={MainLayout}
          path="/home"/>
        <RouteWithLayout
            component={SignUp}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/sign-up"/>
        <RouteWithLayout
            component={SignIn}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/sign-in"/>
        <RouteWithLayout
            component={RedefinePassword}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/redefine-password"/>
        <RouteWithLayout
            component={ResetPassword}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/reset-password/:token"/>

      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
