import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import App from '../App';
import planetsData from '../../cypress/mocks/testData';

describe('StarWars planets search', () => {
  beforeEach(async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(planetsData)
    });
    await act(async () => {
      render(<App />);
    });
  });

  test('Se o input search existe', () => {
    const search = screen.getByTestId('name-filter');
    expect(search).toBeInTheDocument();
  });
  test('Se o botão de filtro numerico existe', () => {
    const filterButton = screen.getByTestId('button-filter');
    expect(filterButton).toBeInTheDocument();
  });
  test('Se os inputs de filtro numerico existem', () => {
    const column = screen.getByTestId('column-filter');
    expect(column).toBeInTheDocument();
    expect(column).toHaveValue('population');
    const comparision = screen.getByTestId('comparison-filter');
    expect(comparision).toBeInTheDocument();
    expect(comparision).toHaveValue('maior que');
    const inputValue = screen.getByTestId('value-filter');
    expect(inputValue).toHaveValue(0);
  });
  test('Se os filtros numericos são adicionados na tela', () => {
    const selectColumn = screen.getByTestId('column-filter');
    const selectComparision = screen.getByTestId('comparison-filter');
    const inputValue = screen.getByTestId('value-filter');

    userEvent.selectOptions(selectColumn, 'population');
    userEvent.selectOptions(selectComparision, 'menor que');
    userEvent.type(inputValue, "2000");

    const filterButton = screen.getByTestId('button-filter');
    userEvent.click(filterButton);

    const buttonRemoveFilter = screen.getByTestId('button-remove-filters')
    expect(buttonRemoveFilter).toBeInTheDocument();
  });
  test('Se o botão search filtra os nomes pesquisados', () => {
    const search = screen.getByTestId('name-filter');

    userEvent.type(search, 'oo');

    const filterButton = screen.getByTestId('button-filter');
    userEvent.click(filterButton);

    const tatooine = screen.getByRole('cell', {name: /tatooine/i});
    const naboo = screen.getByRole('cell', {name: /naboo/i});
    expect(tatooine && naboo).toBeInTheDocument();
  });
})
