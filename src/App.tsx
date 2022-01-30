import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { login as serverLogin } from 'modules/auth/data/actions';
import { Operator } from 'modules/global-data';

function App() {
  const [operator, setOperator] = useState<Operator>()
  async function login(){
    const {userInfo} = await serverLogin();
    setOperator(new Operator(userInfo));
  }

  return (
    <div className="App">
      <button onClick={() => login()}>login</button>
    </div>
  );
}

export default App;
