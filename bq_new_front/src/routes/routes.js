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
    ProfileDetails,
    RedefinePassword,
    ResetPassword,
    CourseList,
    SkillTable,
    ObjectTable

} from '../pages';
import SkillDetails from "../pages/Administrator/Skill/SkillDetails";
import ObjectDetails from "../pages/Administrator/Object/ObjectDetails";

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
            component={ProfileDetails}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/profile-details"/>
        <RouteWithLayout
            component={ProfileDetails}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/profile-details/:codigoProfile"/>
        <RouteWithLayout
            component={SkillTable}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/skills"/>
        <RouteWithLayout
            component={SkillDetails}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/skill-details"/>
        <RouteWithLayout
            component={SkillDetails}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/skill-details/:codigoSkill"/>
        <RouteWithLayout
            component={ObjectTable}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/objects"/>
        <RouteWithLayout
            component={ObjectDetails}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/object-details"/>
        <RouteWithLayout
            component={ObjectDetails}
            exact
            layout={MainLayout}
            needToBeLogged={true}
            path="/object-details/:codigoObject"/>
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
