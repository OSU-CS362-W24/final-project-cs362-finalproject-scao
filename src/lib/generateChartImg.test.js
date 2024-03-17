const generateChartImg = require('./generateChartImg');
require('whatwg-fetch');

describe('testing the generateChartImg', () => {

    test('generateChartImg makes a chart image for a line chart', async () => {
        //Arrange
        const type = 'line';
        const data = [
            {x:0, y:0},
            {x:4, y:(-2)},
            {x:2, y:34}
        ];
        const xLabel = 'x-axis';
        const yLabel = 'y-axis';
        const title = 'title';
        const color = '#FFFF00';

        //Act
        const chart = await generateChartImg(type, data, xLabel, yLabel, title, color);

        //Assert
        expect(chart).toBeTruthy();
        expect(chart.startsWith('blob:')).toBe(true);
    });

    test('generateChartImg makes a chart image for a scatter chart', async () => {
        //Arrange
        const type = 'scatter';
        const data = [
            {x:0, y:0},
            {x:4, y:(-2)},
            {x:2, y:34}
        ];
        const xLabel = 'x-axis';
        const yLabel = 'y-axis';
        const title = 'title';
        const color = '#FFFF00';

        //Act
        const chart = await generateChartImg(type, data, xLabel, yLabel, title, color);

        //Assert
        expect(chart).toBeTruthy();
        expect(chart.startsWith('blob:')).toBe(true);
    });

    test('generateChartImg makes a chart image for a bar graph', async () => {
        //Arrange
        const type = 'bar';
        const data = [
            {x:0, y:0},
            {x:4, y:(-2)},
            {x:2, y:34}
        ];
        const xLabel = 'x-axis';
        const yLabel = 'y-axis';
        const title = 'title';
        const color = '#FFFF00';

        //Act
        const chart = await generateChartImg(type, data, xLabel, yLabel, title, color);

        //Assert
        expect(chart).toBeTruthy();
        expect(chart.startsWith('blob:')).toBe(true);
    });
});