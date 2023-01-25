import React, { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContext';
import NameFilterContext from '../context/NameFilterContext';

function Table() {
  const { list } = useContext(PlanetsContext);
  const { searchName, handleChange } = useContext(NameFilterContext);

  return (
    <div>
      <div>
        <label htmlFor="name-filter">
          Filtrar por texto:
          <input
            data-testid="name-filter"
            id="name-filter"
            type="text"
            value={ searchName }
            onChange={ handleChange }
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {list.filter((planetFiltered) => planetFiltered.name.toLocaleLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/gi, '')
            .includes(searchName.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/gi, '')))
            .map((planet, index) => (
              <tr key={ index }>
                <td>{ planet.name }</td>
                <td>{ planet.rotation_period }</td>
                <td>{ planet.orbital_period }</td>
                <td>{ planet.diameter }</td>
                <td>{ planet.climate }</td>
                <td>{ planet.gravity }</td>
                <td>{ planet.terrain }</td>
                <td>{ planet.surface_water }</td>
                <td>{ planet.population }</td>
                <td>{ planet.films }</td>
                <td>{ planet.created }</td>
                <td>{ planet.edited }</td>
                <td>{ planet.url }</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
