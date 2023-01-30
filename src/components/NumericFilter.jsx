import React, { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContext';

export default function NumericFilter() {
  const {
    valueFilter,
    handleChangeNumericFilter,
    filterPlanetsByColumn,
  } = useContext(PlanetsContext);

  return (
    <div>
      <select
        data-testid="column-filter"
        name="columnFilter"
        onChange={ handleChangeNumericFilter }
      >
        <option value="population">population</option>
        <option value="orbital_period">orbital_period</option>
        <option value="diameter">diameter</option>
        <option value="rotation_period">rotation_period</option>
        <option value="surface_water">surface_water</option>
      </select>
      <select
        data-testid="comparison-filter"
        name="comparisonFilter"
        onChange={ handleChangeNumericFilter }
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>
      <input
        data-testid="value-filter"
        type="number"
        name="valueFilter"
        value={ valueFilter }
        onChange={ handleChangeNumericFilter }
      />
      <button
        data-testid="button-filter"
        onClick={ filterPlanetsByColumn }
      >
        Filtrar
      </button>
    </div>
  );
}
