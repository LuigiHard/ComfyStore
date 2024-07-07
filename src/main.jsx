import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import { store } from './store.js';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const domain = "dev-1wzo5dt227mjr2xi.us.auth0.com";
const clientId = "UuvjM6uTw6NAV94hgKVjhGgSJMxyjGhs";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
  >
    <Provider store={store}>
      <App />
      <ToastContainer position='top-center' />
    </Provider>
  </Auth0Provider>
);
