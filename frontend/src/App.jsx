import React from 'react';
import DbStatus from './components/DbStatus';

function App() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">damMilam</h1>
      <DbStatus />
    </div>
  );
}

export default App;
