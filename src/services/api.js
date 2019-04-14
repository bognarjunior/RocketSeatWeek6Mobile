import axios from 'axios';

const api = axios.create({
  // Não está funcionando o deploy do Heroku
  // baseURL: 'https://omnistack-backend-bognar.herokuapp.com'
  baseURL: 'https://omnistack-backend.herokuapp.com'
});

export default api;
