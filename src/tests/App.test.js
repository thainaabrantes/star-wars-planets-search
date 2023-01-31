import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import App from '../App';
import planetsData from '../../cypress/mocks/testData';

beforeEach(async () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.resolve({
    json: () => Promise.resolve(planetsData)
  }));
});
afterEach(() => {
  jest.resetAllMocks();
})
describe('Testa da StarWars planets search', () => {

  test("Se a tabela existe", async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });
  test("Se todos os planetas são renderizados", async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const planets = await screen.findAllByTestId('planet-name');
    expect(planets).toHaveLength(10);
  });
  test('Se o input search existe', () => {
    render(<App />);
    const search = screen.getByTestId('name-filter');
    expect(search).toBeInTheDocument();
  });
  test('Se o botão de filtro numerico existe', () => {
    render(<App />);
    const filterButton = screen.getByTestId('button-filter');
    expect(filterButton).toBeInTheDocument();
  });
  test('Se os inputs de filtro numerico existem', () => {
    render(<App />);
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
    render(<App />);
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
  test('Testa o filtro numerico "igual a"', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const selectColumn = screen.getByTestId('column-filter');
    const selectComparision = screen.getByTestId('comparison-filter');
    const inputValue = screen.getByTestId('value-filter');

    userEvent.selectOptions(selectColumn, 'rotation_period');
    userEvent.selectOptions(selectComparision, 'igual a');
    userEvent.type(inputValue, '23');

    const filterButton = screen.getByTestId('button-filter');
    userEvent.click(filterButton);

    const tatooine = await screen.findByRole('cell', {  name: /tatooine/i});
    const hoth = await screen.findByRole('cell', {  name: /hoth/i});
    const dagobah = await screen.findByRole('cell', {  name: /dagobah/i});
    expect(tatooine && hoth && dagobah).toBeInTheDocument();
  });
  test('Testa o filtro numerico "maior que"', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'rotation_period');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'maior que');
    userEvent.type(screen.getByTestId('value-filter'), '25');

    userEvent.click(screen.getByTestId('button-filter'));

    const naboo = await screen.findByRole('cell', {  name: /naboo/i});
    const kamino = await screen.findByRole('cell', {  name: /kamino/i});
    expect(naboo && kamino).toBeInTheDocument();
  });
  test('Testa o filtro numerico "menor que"', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'rotation_period');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'menor que');
    userEvent.type(screen.getByTestId('value-filter'), '23');

    userEvent.click(screen.getByTestId('button-filter'));

    const bespin = await screen.findByRole('cell', {  name: /bespin/i});
    const endor = await screen.findByRole('cell', {  name: /endor/i});
    expect(bespin && endor).toBeInTheDocument();
  });
  test('Se o botão search filtra os nomes pesquisados', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const search = screen.getByTestId('name-filter');

    userEvent.type(search, 'oo');

    const filterButton = screen.getByTestId('button-filter');
    userEvent.click(filterButton);

    const tatooine = await screen.findByRole('cell', {name: /tatooine/i});
    const naboo = await screen.findByRole('cell', {name: /naboo/i});
    expect(tatooine && naboo).toBeInTheDocument();
  });
})
