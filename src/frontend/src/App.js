// src/App.js

import React from 'react';
import Chat from './components/chat'; // Importa el componente de chat
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplicación de Chat</h1>
      </header>
      <Chat /> {/* Agrega el componente Chat aquí */}
    </div>
  );
}

export default App;
