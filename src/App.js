import React from 'react';
import Table from './components/Table';
import PlanetsProvider from './context/PlanetsProvider';
import NameFilterProvider from './context/NameFilterProvider';

function App() {
  return (
    <PlanetsProvider>
      <NameFilterProvider>
        <Table />
      </NameFilterProvider>
    </PlanetsProvider>
  );
}

export default App;
