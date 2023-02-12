import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [planetsToRender, setPlanetsToRender] = useState([]);
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

  useEffect(() => {
    setPlanetsToRender(planets);
  }, [planets]);

  const handleChangeSearch = ({ target }) => {
    setSearchName(target.value);
  };

  const handleChangeNumericFilter = ({ target }) => {
    if (target.name === 'columnFilter') setColumnFilterSelected(target.value);
    if (target.name === 'comparisonFilter') setComparisonFilterSelected(target.value);
    if (target.name === 'valueFilter') setValueFilter(target.value);
  };

  const filterNumerically = (planet, columnFilter, comparisonFilter, value) => {
    if (comparisonFilter === 'maior que') {
      return (Number(planet[columnFilter]) > value);
    }
    if (comparisonFilter === 'menor que') {
      return (Number(planet[columnFilter]) < value);
    }
    if (comparisonFilter === 'igual a') {
      return (planet[columnFilter] === value);
    }
    return true;
  };

  const implementNumericFilter = () => {
    const filteredPlanetsByColumn = planetsToRender
      .filter((planet) => filterNumerically(
        planet,
        columnFilterSelected,
        comparisonFilterSelected,
        valueFilter,
      ));

    setPlanetsToRender(filteredPlanetsByColumn);
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
    const columnFiltersAfterRemoval = filterByNumericValues
      .filter((filter) => filter.column !== filterParam.column);

    setFilterByNumericValues(columnFiltersAfterRemoval);

    setColumnFilterValues([...columnFilterValues, filterParam.column]);

    let planetsAfterRemoveFilter = [];
    filterByNumericValues.forEach((filter) => {
      planetsAfterRemoveFilter = planets.filter((planet) => filterNumerically(
        planet,
        filter.column,
        filter.comparison,
        filter.value,
      ));
    });
    setPlanetsToRender(planetsAfterRemoveFilter);
    console.log(planetsAfterRemoveFilter);
  };

  return (
    <PlanetsContext.Provider
      value={ {
        planetsToRender,
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
