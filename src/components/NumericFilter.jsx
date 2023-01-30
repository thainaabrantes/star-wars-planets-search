import React, { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContext';

export default function NumericFilter() {
  const {
    columnFilterValues,
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
        {
          columnFilterValues.map((value, i) => (
            <option key={ i } value={ value }>{ value }</option>
          ))
        }
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
