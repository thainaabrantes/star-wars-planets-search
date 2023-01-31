import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [columnFilterValues, setColumnFilterValues] = useState([
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ]);
  const [columnFilterSelected, setColumnFilterSelected] = useState('population');
  const [comparisonFilterSelected, setComparisonFilterSelected] = useState('maior que');
  const [valueFilter, setValueFilter] = useState(0);
  const [filterByNumericValues, setFilterByNumericValues] = useState([]);

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

  const handleChangeNumericFilter = ({ target }) => {
    if (target.name === 'columnFilter') setColumnFilterSelected(target.value);
    if (target.name === 'comparisonFilter') setComparisonFilterSelected(target.value);
    if (target.name === 'valueFilter') setValueFilter(target.value);
  };

  const implementNumericFilter = () => {
    const filteredPlanetsByColumn = planets.filter((planet) => {
      if (comparisonFilterSelected === 'maior que') {
        return (Number(planet[columnFilterSelected]) > valueFilter);
      }
      if (comparisonFilterSelected === 'menor que') {
        return (Number(planet[columnFilterSelected]) < valueFilter);
      }
      if (comparisonFilterSelected === 'igual a') {
        return (planet[columnFilterSelected] === valueFilter);
      }
      return true;
    });

    setPlanets(filteredPlanetsByColumn);
    setColumnFilterSelected(columnFilterValues[0]);
  };

  useEffect(() => {
    implementNumericFilter();
  }, [columnFilterValues]);

  const setColumnValuesToFilter = () => {
    setFilterByNumericValues([...filterByNumericValues, {
      column: columnFilterSelected,
      comparison: comparisonFilterSelected,
      value: valueFilter.toString(),
    }]);

    setColumnFilterValues(columnFilterValues
      .filter((value) => value !== columnFilterSelected));
  };

  const removeFilter = (filterParam) => {
    setFilterByNumericValues(filterByNumericValues
      .filter((item) => item.column !== filterParam));

    setColumnFilterValues([...columnFilterValues, filterParam.column]);
    // console.log(filterByNumericValues);
  };

  return (
    <PlanetsContext.Provider
      value={ {
        planets,
        searchName,
        handleChangeSearch,
        columnFilterValues,
        valueFilter,
        handleChangeNumericFilter,
        setColumnValuesToFilter,
        filterByNumericValues,
        removeFilter,
      } }
    >
      { children }
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
