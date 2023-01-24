import { useState, useEffect } from 'react';
import Table from './components/Table';

function App() {
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch('https://swapi.dev/api/planets')
      .then((response) => response.json())
      .then((data) => {
        const planetsWithoutResidents = data.results.map((result) => {
          delete result.residents;
          return result;
        });
        setPlanets(planetsWithoutResidents);
      });
  }, []);

  return (
    <div><Table planets={ planets } /></div>
  );
}

export default App;
