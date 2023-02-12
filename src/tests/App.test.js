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
  // global.fetch = jest.fn().mockResolvedValue({
  //   json: jest.fn().mockResolvedValue(planetsData)
  // })
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
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    let planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);

    const selectColumn = screen.getByTestId('column-filter');
    const rotationPeriod = screen.getByRole('option', {name: /rotation_period/i});

    const selectComparision = screen.getByTestId('comparison-filter');
    const igualA = screen.getByRole('option', {name: /igual a/i});

    const inputValue = screen.getByTestId('value-filter');

    userEvent.selectOptions(selectColumn, rotationPeriod);
    userEvent.selectOptions(selectComparision, igualA);

    userEvent.clear(inputValue);
    userEvent.type(inputValue, '23');

    const filterButton = screen.getByTestId('button-filter');
    userEvent.click(filterButton);

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(3);
  });
  test('Testa o filtro numerico "maior que"', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    let planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);

    userEvent.selectOptions(screen.getByTestId('column-filter'), screen.getByRole('option', {name: /rotation_period/i}));
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), screen.getByRole('option', {name: /maior que/i}));

    userEvent.clear(screen.getByTestId('value-filter'));
    userEvent.type(screen.getByTestId('value-filter'), '25');

    userEvent.click(screen.getByTestId('button-filter'));

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(2);
  });
  test('Testa o filtro numerico "menor que"', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    let planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);

    userEvent.selectOptions(screen.getByTestId('column-filter'), screen.getByRole('option', {name: /rotation_period/i}));
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), screen.getByRole('option', {name: /menor que/i}));

    userEvent.clear(screen.getByTestId('value-filter'));
    userEvent.type(screen.getByTestId('value-filter'), '23');

    userEvent.click(screen.getByTestId('button-filter'));

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(2);
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
  test('Se o filtro é removido ao clicar no botão de remover filtro', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    let planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);
    
    userEvent.selectOptions(screen.getByTestId('column-filter'), screen.getByRole('option', {name: /orbital_period/i}));
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), screen.getByRole('option', {name: /menor que/i}));

    userEvent.clear(screen.getByTestId('value-filter'));
    userEvent.type(screen.getByTestId('value-filter'), '400');

    userEvent.click(screen.getByTestId('button-filter'));

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(5);

    expect(await screen.findByText(/orbital_period menor que 400/i)).toBeInTheDocument();

    userEvent.click(await screen.findByTestId('button-remove-filter'));

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);
  });
  test('Se todos os filtros são removidos ao clicar no botão de remover filtros', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    let planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);
    
    userEvent.selectOptions(screen.getByTestId('column-filter'), screen.getByRole('option', {name: /orbital_period/i}));
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), screen.getByRole('option', {name: /menor que/i}));

    userEvent.clear(screen.getByTestId('value-filter'));
    userEvent.type(screen.getByTestId('value-filter'), '400');

    userEvent.click(screen.getByTestId('button-filter'));

    expect(await screen.findByText(/orbital_period menor que 400/i)).toBeInTheDocument();

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(5);

    userEvent.selectOptions(screen.getByTestId('column-filter'), screen.getByRole('option', {name: /rotation_period/i}));
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), screen.getByRole('option', {name: /igual a/i}));

    userEvent.clear(screen.getByTestId('value-filter'));
    userEvent.type(screen.getByTestId('value-filter'), '24');

    userEvent.click(screen.getByTestId('button-filter'));

    expect(await screen.findByText(/rotation_period igual a 24/i)).toBeInTheDocument();

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(2);

    userEvent.click(await screen.findByTestId('button-remove-filters'));

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);
  });
  test('Se todos os planetas são renderizados ao excluir todos os filtros por vez', async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    let planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);
    
    userEvent.selectOptions(screen.getByTestId('column-filter'), screen.getByRole('option', {name: /orbital_period/i}));
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), screen.getByRole('option', {name: /menor que/i}));

    userEvent.clear(screen.getByTestId('value-filter'));
    userEvent.type(screen.getByTestId('value-filter'), '400');

    userEvent.click(screen.getByTestId('button-filter'));

    expect(await screen.findByText(/orbital_period menor que 400/i)).toBeInTheDocument();

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(5);

    userEvent.selectOptions(screen.getByTestId('column-filter'), screen.getByRole('option', {name: /rotation_period/i}));
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), screen.getByRole('option', {name: /igual a/i}));

    userEvent.clear(screen.getByTestId('value-filter'));
    userEvent.type(screen.getByTestId('value-filter'), '24');

    userEvent.click(screen.getByTestId('button-filter'));

    expect(await screen.findByText(/rotation_period igual a 24/i)).toBeInTheDocument();

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(2);

    const buttons = await screen.findAllByTestId('button-remove-filter');
    userEvent.click(buttons[1]);

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(5);

    userEvent.click(await screen.findByTestId('button-remove-filter'));

    planets = await screen.findAllByTestId(/planet-name/i);
    expect(planets.length).toEqual(10);
  });
})
