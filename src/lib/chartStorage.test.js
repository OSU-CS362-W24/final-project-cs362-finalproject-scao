/**
 * @jest-environment jsdom
 */

const {saveChart, loadAllSavedCharts, loadSavedChart, updateCurrentChartData,loadCurrentChartData} = require('./chartStorage');

require('@testing-library/jest-dom');


//Set up for mock of localStorage from Jamie on Stack Overflow
//Jamie. (2022, Dec. 11). "How do I deal with localStorage in jest tests?"
//URL: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests/41434763#41434763

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

describe('testing the loadAllSavedCharts function', () => {

    test('returns an empty array if there are currently no saved graphs', () => {
        //Arrange
        getItemMock.mockReturnValueOnce(JSON.stringify([]));

        //Act
        const result = loadAllSavedCharts();

        //Assert
        expect(result).toEqual([]);
    });

    test('returns the list of all charts stored', () => {
        //Arrange
        const charts = [{title: '1'}, {title: '2'}];
        getItemMock.mockReturnValueOnce(JSON.stringify(charts));

        //Act
        const result = loadAllSavedCharts();

        //Assert
        expect(result).toEqual(charts);
    });
});

describe('testing the loadSavedChart function', () => {

    test('returns an empty object if the given index doesnt exist', () => {
        //Arrange
        const charts = [{title: '1'}, {title: '2'}];
        getItemMock.mockReturnValueOnce(JSON.stringify(charts));

        //Act
        const result = loadSavedChart(3);

        //Assert
        expect(result).toEqual({});
    });

    test('returns the chart given by the index', () => {
        //Arrange
        const charts = [{title: '1'}, {title: '2'}];
        getItemMock.mockReturnValueOnce(JSON.stringify(charts));

        //Act
        const result = loadSavedChart(1);

        //Assert
        expect(result).toEqual({title: '2'});
    });
});

describe('testing the updateCurrentChartData function', () => {

    test('saves the current chart being worked on in local storage', () => { 
        //Arrange
        const chart = {title: 'work in progress'};

        //Act
        updateCurrentChartData(chart);

        //Assert
        expect(setItemMock).toHaveBeenCalledTimes(1);
        expect(setItemMock).toHaveBeenNthCalledWith(1, 'currentChartData', JSON.stringify(chart));
    });
});

describe('testing the loadCurrentChartData function', () => {

    test('returns an empty object if there is no cuurent chart saved in local storage', () => {
        //Arrange
        getItemMock.mockReturnValueOnce(JSON.stringify({}));

        //Act
        const result = loadCurrentChartData();

        //Assert
        expect(result).toEqual({});
    });

    test('returns the current chart being worked on from locale storage', () => {
        //Arrange
        const chart = {title: 'work in progress'};
        getItemMock.mockReturnValueOnce(JSON.stringify(chart));

        //Act
        const result = loadCurrentChartData();

        //Assert
        expect(result).toEqual(chart);
    });
});