import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import {isAuthenticated} from "./../../services/auth";

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, needToBeLogged, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
          needToBeLogged ? (
               isAuthenticated() ? (
                  <Layout>
                      <Component {...matchProps} />
                  </Layout>
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
  path: PropTypes.string
};

export default RouteWithLayout;
