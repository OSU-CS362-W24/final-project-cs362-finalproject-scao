const sortPoints = require('./sortPoints');

describe('testing for the sortPoints function, only tests valid input', () => {
    
    test('can sort a single point and return it', () => {
    //Arrange
    const arg = [{x:0, y:0}];

    //Act
    const result = sortPoints(arg);

    //Assert
    expect(result).toEqual([{x: 0,y: 0}]);
    });

    test('can sort multiple points', () => {
    //Arrange
    const arg = [
                {x:13, y:(0)},
                {x:0, y:0},
                {x:5, y:7},
                {x:3, y:(-4)}
                ];
    
    //Act
    const result = sortPoints(arg);
    
    //Assert
    expect(result).toEqual([
        {x:0, y:0},
        {x:3, y:(-4)},
        {x:5, y:7},
        {x:13, y:(0)}
        ]);
    });

    test('can sort when x is negative', () => {
    //Arrange
    const arg = [
        {x:13, y:(0)},
        {x:0, y:0},
        {x:5, y:7},
        {x:3, y:(-4)},
        {x:(-2), y:3}
        ];  
    
    //Act
    const result = sortPoints(arg);
    
    //Assert
    expect(result).toEqual([
        {x:(-2), y:3},
        {x:0, y:0},
        {x:3, y:(-4)},
        {x:5, y:7},
        {x:13, y:(0)}
        ]);
    });

    test('can sort with floats/doubles', () => {
    //Arrange
    const arg = [
        {x:13, y:(0)},
        {x:4, y:0},
        {x:3.9, y:7},
        {x:3, y:(-4)},
        {x:(-2.5), y:3}
        ];
    
    //Act
    const result = sortPoints(arg);
    
    //Assert
    expect(result).toEqual([
        {x:(-2.5), y:3},
        {x:3, y:(-4)},
        {x:3.9, y:7},
        {x:4, y:0},
        {x:13, y:(0)}
        ]);
    });

    test('can sort when there are multiple points with the same x', () => {
    //Arrange   
    const arg = [
        {x:13, y:(0)},
        {x:4, y:0},
        {x:4, y:7},
        {x:3, y:(-4)},
        {x:(-2.5), y:3}
        ];
    
    //Act
    const result = sortPoints(arg);
    
    //Assert
    expect(result).toEqual([
        {x:(-2.5), y:3},
        {x:3, y:(-4)},
        {x:4, y:0},
        {x:4, y:7},
        {x:13, y:(0)}
        ]);
    });
})