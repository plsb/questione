import React from 'react';

import { Link } from 'react-router-dom';

import Logo from '../Logo';

//import styles
import './login-style.css';

//importar components
const Login = () => {
  return (
    <div className="container-login-teste">
      <div class="MuiToolbar-root"></div>
      <Logo></Logo>
      <div class="logo-bq"></div>

      <div className="container-login">
        <div className="form-login">
          <form>
            <div className="input-group">
              <label></label>
              <input type="email" placeholder="E-mail" />
            </div>
            <div className="input-group">
              <label></label>
              <input type="password" placeholder="Senha" />
            </div>

            <div className="btn-group">
              <button className="btn-logar">
                <Link rel="../components/index" className="btn-link" to="">
                  LOGAR
                </Link>
              </button>
            </div>
            <div className="input-group">
              <Link className="forgot-password">Esqueci a Senha</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
