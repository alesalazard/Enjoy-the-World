/* eslint-disable no-undef */
import { onNavigate } from '../main.js';
import { signInUser } from '../firebase/connection.js';

export const login = () => {
  const containerLogin = document.createElement('section');
  containerLogin.classList.add('container');

  const titleLo = document.createElement('h1');
  titleLo.textContent = 'INICIA SESIÓN';
  titleLo.className = 'title-vistas';

  const imgLogin = document.createElement('img');
  imgLogin.className = 'img-world';
  imgLogin.src = '/img/logo.png';
  imgLogin.alt = 'logo';

  const loginForm = document.createElement('section');
  loginForm.classList.add('form-login');

  const loginEmail = document.createElement('input');
  loginEmail.classList.add('input');
  loginEmail.setAttribute('type', 'email');
  loginEmail.setAttribute('id', 'email-login');
  loginEmail.setAttribute('placeholder', 'Email');
  loginEmail.setAttribute('required', '');

  const loginPassword = document.createElement('input');
  loginPassword.classList.add('input');
  loginPassword.setAttribute('type', 'password');
  loginPassword.setAttribute('id', 'password-login');
  loginPassword.setAttribute('placeholder', 'Contraseña');
  loginPassword.setAttribute('required', '');

  const loginButton = document.createElement('button');
  loginButton.textContent = 'Iniciar Sesión';
  loginButton.setAttribute('class', 'button-login button');

  const question = document.createElement('h3');
  question.textContent = '¿Olvidaste tu contraseña?';
  question.classList.add('question');

  const session = document.createElement('a');
  session.setAttribute('href', '#');
  session.textContent = 'Haz clic aquí';
  session.className = 'link';

  session.addEventListener('click', () => {
    onNavigate('/');
  });

  containerLogin.append(
    titleLo,
    imgLogin,
    loginEmail,
    loginPassword,
    loginButton,
    question,
    session,
  );

  containerLogin
    .querySelector('.button-login')
    .addEventListener('click', (e) => {
      e.preventDefault();
      const emailLogin = loginEmail.value;
      const passLogin = loginPassword.value;

      signInUser(emailLogin, passLogin)
        .then(() => {
          onNavigate('/wall');
          swal({
            title: 'Excelente',
            text: 'Ya puedes postear!',
            icon: 'success',
          });
        })
        .catch(() => {
          onNavigate('/login');
          swal({
            title: 'Oh no, algo salió mal!',
            text: 'Valida tus datos',
            icon: 'error',
          });
        });
    });

  return containerLogin;
};
