/**
 * @jest-environment jsdom
 */

const {saveChart, loadAllSavedCharts, loadSavedChart, updateCurrentChartData, loadCurrentChartData} = require('./chartStorage');

require('@testing-library/jest-dom');

//mock of local storage is taken from https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests/41434763#41434763
//mock local storage
const setItemMock = jest.fn();
const getItemMock = jest.fn();

beforeEach(() => {
    Storage.prototype.setItem = setItemMock;
    Storage.prototype.getItem = getItemMock;
});

afterEach(() => {
    setItemMock.mockRestore();
    getItemMock.mockRestore();
});


describe('testing the functions in chartStorage with valid input', () => {
    test('saveChart adds a chart to localStorage', () => {
        // Arrange
        const chart = { title: "asndf" };
        const index = null;

        // Act
        saveChart(chart, index);

        // Assert
        expect(setItemMock).toHaveBeenCalledWith('savedCharts', JSON.stringify([chart]));
    });
});