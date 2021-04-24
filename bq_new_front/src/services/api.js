import axios from 'axios';
import {getToken, logout} from "./auth";
import Swal from "sweetalert2";
import React from "react";

//configuration alert
const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

function loadAlert(icon, message) {
  Toast.fire({
    icon: icon,
    title: message
  });
}

const api = axios.create({
  baseURL: 'https://bancodequestoes.ifce.edu.br/api',
  //baseURL: 'https://200.17.32.102/api',
  //  baseURL: 'http://127.0.0.1:8000/api',
  /*headers: {
    'Content-Type': 'application/json'
  }*/
});

api.interceptors.request.use(async config=> {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(async response => {

  return response;
}, function (error) {
  const { response: { data, status } } = error;

  //verifica se o código de resposta é 401 (não autorizado ou 500 (erro interno no servidor)
  if (status === 401) {
    loadAlert('error', 'Não autorizado.');
    logout();
    window.location.href = '/sign-in';
    return false;
  } else if (status === 500) {
    loadAlert('error', 'Erro interno no servidor da API.');
    logout();
    window.location.href = '/sign-in';
    return false;
  }
  if(data) {
    loadAlert('error', data.message);
  } else {
    loadAlert('error', error);
  }


});

export default api;
