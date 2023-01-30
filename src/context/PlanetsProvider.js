import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [columnFilter, setColumnFilter] = useState('population');
  const [comparisonFilter, setComparisonFilter] = useState('maior que');
  const [valueFilter, setValueFilter] = useState(0);

  useEffect(() => {
    fetch('https://swapi.dev/api/planets')
      .then((response) => response.json())
      .then((data) => {
        setPlanets(data.results.map((result) => {
          delete result.residents;
          return result;
        }));
      });
  }, []);

  const handleChangeSearch = ({ target }) => {
    setSearchName(target.value);
  };

  const filteredPlanets = planets.filter((planet) => planet.name.toLocaleLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/gi, '')
    .includes(searchName.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/gi, '')));

  const handleChangeNumericFilter = ({ target }) => {
    if (target.name === 'columnFilter') setColumnFilter(target.value);
    if (target.name === 'comparisonFilter') setComparisonFilter(target.value);
    if (target.name === 'valueFilter') setValueFilter(target.value);
  };

  const filterPlanetsByColumn = () => {
    const filteredPlanetsByColumn = filteredPlanets.filter((planet) => {
      if (comparisonFilter === 'maior que') {
        return (Number(planet[columnFilter]) > valueFilter);
      }
      if (comparisonFilter === 'menor que') {
        return (Number(planet[columnFilter]) < valueFilter);
      }
      if (comparisonFilter === 'igual a') {
        return (planet[columnFilter] === valueFilter);
      }
      return true;
    });
    console.log(filteredPlanetsByColumn);
    setPlanets(filteredPlanetsByColumn);
  };

  return (
    <PlanetsContext.Provider
      value={ {
        filteredPlanets,
        searchName,
        handleChangeSearch,
        valueFilter,
        handleChangeNumericFilter,
        filterPlanetsByColumn,
      } }
    >
      { children }
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
