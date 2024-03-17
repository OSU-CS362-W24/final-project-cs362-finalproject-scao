/**
 * @jest-environment jsdom
 */

const {saveChart, loadAllSavedCharts, loadSavedChart, updateCurrentChartData,loadCurrentChartData} = require('./chartStorage');

require('@testing-library/jest-dom');


//mock local storage
const setItemMock = jest.fn();
const getItemMock = jest.fn();

beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: getItemMock,
            setItem: setItemMock
        },
        writable: true
    });
});

afterEach(() => {
    jest.clearAllMocks();
});


describe('testing the functions in chartStorage with valid input', () => {

    test('saveChart adds a chart to localStorage that is empty', () => {
        // Arrange
        const chart = { title: "asndf" };
        const index = null;

        // Act
        saveChart(chart, index);

        // Assert
        expect(setItemMock).toHaveBeenCalledTimes(1);
        expect(setItemMock).toHaveBeenNthCalledWith(1, 'savedCharts', JSON.stringify([chart]));
    });

    test('saveChart adds a chart to localStorage that has atleast one chart already stored', () => {
        // Arrange
        const chart1 = { title: "1" };
        const index1 = null;
        const chart2 = { title: "2" };
        const index2 = null;

        //mock the loadAllSavedCharts function
        getItemMock.mockReturnValueOnce(JSON.stringify([chart1]));

        // Act
        saveChart(chart2, index2);

        // Assert
        expect(setItemMock).toHaveBeenCalledTimes(1);
        expect(setItemMock).toHaveBeenNthCalledWith(1, 'savedCharts', JSON.stringify([chart1, chart2]));
    });

    test('saveChart adds a chart to localStorage and overwrites an existing if the same index is given', () => {
        // Arrange
        const chart1 = { title: "1" };
        const index1 = 0;
        const chart2 = { title: "2" };
        const index2 = 0;

        //mock the loadAllSavedCharts function
        getItemMock.mockReturnValueOnce(JSON.stringify([chart1]));

        // Act
        saveChart(chart2, index2);

        // Assert
        expect(setItemMock).toHaveBeenCalledTimes(1);
        expect(setItemMock).toHaveBeenNthCalledWith(1, 'savedCharts', JSON.stringify([chart2]));

    });
});

