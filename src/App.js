import React from 'react';
import Table from './components/Table';
import NumericFilter from './components/NumericFilter';
import PlanetsProvider from './context/PlanetsProvider';

function App() {
  return (
    <PlanetsProvider>
      <NumericFilter />
      <Table />
    </PlanetsProvider>
  );
}

export default App;
