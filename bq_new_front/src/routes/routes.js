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
    SignUp as SignUpView,
    SignIn as SignInView,
    UserList as UserListView,
} from '../pages';

const Routes = () => (
  <BrowserRouter>
    <Switch>
        <RouteWithLayout
            component={UserListView}
            exact
            needToBeLogged={true}
            layout={MainLayout}
            path="/users"/>
        <RouteWithLayout
          component={UserListView}
          exact
          needToBeLogged={true}
          layout={MainLayout}
          path="/home"/>
        <RouteWithLayout
            component={SignUpView}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/sign-up"/>
        <RouteWithLayout
            component={SignInView}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/sign-in"/>
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
