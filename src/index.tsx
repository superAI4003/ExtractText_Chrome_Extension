import React from 'react';
import ReactDOM from 'react-dom/client';
import 'regenerator-runtime/runtime'
import App from './App';

const root = document.createElement("div")
root.className = ""
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
