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
    UserTable,
    ProfileTable,
    RedefinePassword,
    ResetPassword,
    CourseList,
    SkillTable,
    ObjectTable

} from '../pages';

const Routes = () => (
  <BrowserRouter>
    <Switch>
        <Redirect
            exact
            from="/"
            to="/home"
        />
        {/*ROTAS COMUNS*/}
        <RouteWithLayout
          component={UserTable}
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
        {/*ROTAS DO ADMINISTRADOR*/}
        <RouteWithLayout
            component={CourseList}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/courses"/>
        <RouteWithLayout
            component={ProfileTable}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/profiles"/>
        <RouteWithLayout
            component={SkillTable}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/skills"/>
        <RouteWithLayout
            component={ObjectTable}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/objects"/>
        <RouteWithLayout
            component={UserTable}
            exact
            needToBeLogged={true}
            layout={MainLayout}
            path="/users"/>


      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
