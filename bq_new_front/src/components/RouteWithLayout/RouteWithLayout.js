import React, {useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import {isAuthenticated} from "./../../services/auth";
import validate from "validate.js";



const RouteWithLayout = props => {
  const { layout: Layout, component: Component, typeUser, needToBeLogged, ...rest } = props;
  /* typeUser -1 vai servir para identificar um componente que todos precisam ter acesso.
    typeUser 1 somente administrador acessa.
    typeUser 2 somente professor acessa.
                                 */
    const typeStorage = localStorage.getItem('@Questione-acess-level-user');

    useEffect(() => {

    }, [typeStorage]);

  return (
    <Route
      {...rest}
      render={matchProps => (
          needToBeLogged ? (
               isAuthenticated() ? (
                   typeUser==typeStorage || typeUser==-1 ?
                       <Layout>
                           <Component {...matchProps} />
                       </Layout>
                       :
                       <Redirect to={{ pathname: "/Unauthorized", state: { from: props.location } }} />

              ) : (
                  <Redirect to={{ pathname: "/sign-in", state: { from: props.location } }} />
              )

          ) : (
              <Layout>
                  <Component {...matchProps} />
              </Layout>
          )
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  needToBeLogged: PropTypes.any.isRequired,
  path: PropTypes.string,
  typeUser: PropTypes.number,

};

export default RouteWithLayout;
