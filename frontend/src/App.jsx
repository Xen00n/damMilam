import React from 'react';
import DbStatus from './components/DbStatus';
import Logoo from './assets/logoo.png'

function App() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-4">damMilam</h1>
      <img src={Logoo} alt="logo" className='w-32 h-32'/>
      <DbStatus />
    </div>
  );
}

export default App;
