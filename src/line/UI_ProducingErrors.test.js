/**
 * @jest-environment ./src/fixjsdomenvironment.js
 */

const fs = require("fs")
const domTesting = require('@testing-library/dom')
require("whatwg-fetch")         //fixes problems with fetch in node
require('@testing-library/jest-dom')
const userEvent = require("@testing-library/user-event").default
function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function () {
        require(jsPath)
    })
 
}




//const chartBuilder = require("../chartBuilder/chartBuilder") //this is for the spy in Test 2   **EDIT: changed it to using window so I no longer need this

//because of the way input fields are handled between "initDomFromFiles" calls, this just clears all local data before each test
beforeEach(function() {
    window.localStorage.clear()
    window.alert = jest.fn();
})



//----------------Test 2-----------------//
// Purpose: Test that when generating a  //
// chart, empty info fields return an    //
// error message AND empty X or Y labels //
// return an error message.              //
//---------------------------------------//

/*
Modified fields (after clicking on the generate chart button):
-Error message popup (the fact that it occurs)
-Error message text: "Error: Must specify a label for both X and Y!" for no label and "Error: No data specified!" for both fields being empty and no x/y values
*/


//Tests:
//1. Displays error message when trying to generate graph without both X + Y values (and both labels are named)
//2. Doesn't display error message when X value and both labels (X + Y) have input fields filled
//3. Doesn't display error message when Y value and both labels (X + Y) have input fields filled
//4. Error doesn't appear when subseqential X and Y values (using the + button) are the only values filled out (and both labels contain a name)
//5. Displays error message when trying to generate a graph without X label (while x/y value exists) [Essentially only X label is missing]
//6. Displays error message when trying to generate a graph without Y label (while x/y value exists) [Only Y label is missing]
//7. STRESS TEST: Mimic video 2 for Test 2; Having multiple X/Y labels filled out still results in error when label isn't filled


/*Notes:
-If I'm doing tests for both X and Y labels individually throwing an error when blank, I don't think I have to make a test where both are blank at the same time.
-Tests 2, 3, and 4 are *Extra* testing for part one of this integration test.
-Error message title: "localhost:8080 says" (for both alert prompts) [from testing and trying to find ways, there is no way I could find to test this element being displayed]
*/



test("Error message occurs when no X or Y values are inputted AND both labels are correctly filled out", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    const generateChartButton = domTesting.getByRole(document, "button", { name: 'Generate chart' }) 
    const XLabel = domTesting.getByLabelText(document, "X label")
    const YLabel = domTesting.getByLabelText(document, "Y label")
    const spy = jest.spyOn(window, "alert")

    //Act:
    const user = userEvent.setup()
    await user.type(XLabel, "A")
    await user.type(YLabel, "B")
    expect(XLabel).toHaveValue("A")                                                 //Double-checking that input fields correctly filled out, not really required but good to have.
    expect(YLabel).toHaveValue("B")
    await user.click(generateChartButton)

    //Assert:
    expect(spy).toHaveBeenCalledTimes(1)                                            //Spy to check if alert() was called

    const alertText = spy.mock.calls[0][0]                                          //Stores the fields and data stored in the specific function call (in this case the error message alerted)
    expect(alertText).toBe("Error: No data specified!")                             //Checks alert() string

    spy.mockRestore()
})


test("Error message doesn't display when X value AND both labels are filled", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:
    const generateChartButton = domTesting.getByRole(document, "button", { name: 'Generate chart' }) 
    const XLabelBox = domTesting.getByLabelText(document, "X label")
    const YLabelBox = domTesting.getByLabelText(document, "Y label")
    const XValueBox = domTesting.getByLabelText(document, "X")
    const spy = jest.spyOn(window, "alert")

    //Act:
    const user = userEvent.setup()
    await user.type(XLabelBox, "A")
    await user.type(YLabelBox, "B")
    await user.type(XValueBox, "1")
    await user.click(generateChartButton)

    expect(XLabelBox).toHaveValue("A")                                               
    expect(YLabelBox).toHaveValue("B")
    expect(XValueBox).toHaveValue(1)

    //Assert:
    expect(spy).toHaveBeenCalledTimes(0)                                            //Spy shouldn't have been called (no alerts should have been called)
    spy.mockRestore()
})


test("Error message doesn't display when Y value AND both labels are filled", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:
    const generateChartButton = domTesting.getByRole(document, "button", { name: 'Generate chart' }) 
    const XLabelBox = domTesting.getByLabelText(document, "X label")
    const YLabelBox = domTesting.getByLabelText(document, "Y label")
    const YValueBox = domTesting.getByLabelText(document, "Y")
    const spy = jest.spyOn(window, "alert")

    //Act:
    const user = userEvent.setup()
    await user.type(XLabelBox, "A")
    await user.type(YLabelBox, "B")
    await user.type(YValueBox, "2")
    await user.click(generateChartButton)

    expect(XLabelBox).toHaveValue("A")                                               
    expect(YLabelBox).toHaveValue("B")
    expect(YValueBox).toHaveValue(2)
    //console.log(window.alert.mock.calls)                                          //used this to check for error call content (had issues with an error popping up when it shouldn't)

    //Assert:
    expect(spy).toHaveBeenCalledTimes(0)                                            //Spy shouldn't have been called (no alerts should have been called)
    spy.mockRestore()
})


test("No error message will occur if both labels are filled out AND X/Y values were inputted in non-original input box (textbox is created through add values button)", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 
    const generateChartButton = domTesting.getByRole(document, "button", { name: 'Generate chart' }) 
    const XLabelBox = domTesting.getByLabelText(document, "X label")
    const YLabelBox = domTesting.getByLabelText(document, "Y label")
    const spy = jest.spyOn(window, "alert")

    //Act:
    const user = userEvent.setup()
    await user.type(XLabelBox, "A")
    await user.type(YLabelBox, "B")
    await user.click(addValueButton)
    await user.click(addValueButton)

    const xValueArray = domTesting.getAllByLabelText(document, "X")
    const yValueArray = domTesting.getAllByLabelText(document, "Y")
    expect(xValueArray).toHaveLength(3)                                             
    expect(yValueArray).toHaveLength(3)
    
    await user.type(xValueArray[2], "1")
    await user.type(yValueArray[2], "2")

    expect(XLabelBox).toHaveValue("A")                                               
    expect(YLabelBox).toHaveValue("B")
    expect(xValueArray[2]).toHaveValue(1)                                               
    expect(yValueArray[2]).toHaveValue(2)

    await user.click(generateChartButton)
    //console.log(window.alert.mock.calls) 

    //Assert:
    expect(spy).toHaveBeenCalledTimes(0)                                            
    spy.mockRestore()
})


test("Error message IS displayed when X label contains nothing while Y label and X/Y value are valid", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:
    const generateChartButton = domTesting.getByRole(document, "button", { name: 'Generate chart' }) 
    const YLabelBox = domTesting.getByLabelText(document, "Y label")
    const spy = jest.spyOn(window, "alert")

    //Act:
    const user = userEvent.setup()
    await user.type(YLabelBox, "B")

    const xValueArray = domTesting.getAllByLabelText(document, "X")
    const yValueArray = domTesting.getAllByLabelText(document, "Y")
    await user.type(xValueArray[0], "1")
    await user.type(yValueArray[0], "2")
    await user.click(generateChartButton)

    //Assert:
    expect(spy).toHaveBeenCalledTimes(1)                                            

    const alertText = spy.mock.calls[0][0]                                          
    expect(alertText).toBe("Error: Must specify a label for both X and Y!")         //There's a different message for Labels missing, check for this specific message

})


test("Error message IS displayed when Y label contains nothing while X label and X/Y value are valid", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:
    const generateChartButton = domTesting.getByRole(document, "button", { name: 'Generate chart' }) 
    const XLabelBox = domTesting.getByLabelText(document, "X label")
    const spy = jest.spyOn(window, "alert")

    //Act:
    const user = userEvent.setup()
    await user.type(XLabelBox, "A")

    const xValueArray = domTesting.getAllByLabelText(document, "X")
    const yValueArray = domTesting.getAllByLabelText(document, "Y")
    await user.type(xValueArray[0], "1")
    await user.type(yValueArray[0], "2")
    await user.click(generateChartButton)

    //Assert:
    expect(spy).toHaveBeenCalledTimes(1)                                            

    const alertText = spy.mock.calls[0][0]                                          
    expect(alertText).toBe("Error: Must specify a label for both X and Y!")         //There's a different message for Labels missing, check for this specific message

})



test("Multiple instances of X/Y values still results an error when no labels are filled out", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 
    const generateChartButton = domTesting.getByRole(document, "button", { name: 'Generate chart' }) 
    const XLabelBox = domTesting.getByLabelText(document, "X label")
    const YLabelBox = domTesting.getByLabelText(document, "Y label")
    const spy = jest.spyOn(window, "alert")

    //Act:
    const user = userEvent.setup()
    await user.click(addValueButton)
    await user.click(addValueButton)
    await user.click(addValueButton)
    await user.click(addValueButton)
    await user.click(addValueButton)

    expect(XLabelBox).not.toHaveValue()                                               
    expect(YLabelBox).not.toHaveValue()                                             //All new X/Y input boxes created. Checking all stats at this point                             

    const xValueArray = domTesting.getAllByLabelText(document, "X")
    const yValueArray = domTesting.getAllByLabelText(document, "Y")
    expect(xValueArray).toHaveLength(6)                                             
    expect(yValueArray).toHaveLength(6)
    
    await user.type(xValueArray[0], "1")
    await user.type(yValueArray[0], "2")
    expect(xValueArray[0]).toHaveValue(1)                                               
    expect(yValueArray[0]).toHaveValue(2)

    await user.type(xValueArray[1], "3")
    await user.type(yValueArray[1], "4")
    expect(xValueArray[1]).toHaveValue(3)                                               
    expect(yValueArray[1]).toHaveValue(4)

    await user.type(xValueArray[2], "5")
    await user.type(yValueArray[2], "6")
    expect(xValueArray[2]).toHaveValue(5)                                               
    expect(yValueArray[2]).toHaveValue(6)

    await user.type(xValueArray[3], "7")
    await user.type(yValueArray[3], "8")
    expect(xValueArray[3]).toHaveValue(7)                                               
    expect(yValueArray[3]).toHaveValue(8)

    await user.type(xValueArray[4], "9")
    await user.type(yValueArray[4], "10")
    expect(xValueArray[4]).toHaveValue(9)                                               
    expect(yValueArray[4]).toHaveValue(10)

    expect(xValueArray[5]).not.toHaveValue()                                            
    expect(yValueArray[5]).not.toHaveValue()

    await user.click(generateChartButton)                                           //All parts are implemented and checked at this point
    //console.log(window.alert.mock.calls) 

    //Assert:
    expect(spy).toHaveBeenCalledTimes(1)      
    const alertText = spy.mock.calls[0][0]                                          
    expect(alertText).toBe("Error: Must specify a label for both X and Y!") 

    spy.mockRestore()
})



