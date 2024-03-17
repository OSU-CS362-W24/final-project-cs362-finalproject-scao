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



//----------------Test 3-----------------//
// Purpose: Test that when "clear chart  //
// data" is clicked, all input fields    //
// are cleared.                          //
//                                       //
//---------------------------------------//

/*
Modified fields (after clicking "Clear chart data"):
-X/Y values (original and created)
-X/Y labels
-Chart title
-Chart color
*/


//Tests:
//1. X and Y values (original) are cleared when "Clear chart data" button is clicked
//2. Newly created X and Y value input fields are cleared when "Clear chart data" button is clicked.
//2. X and Y labels are cleared when "Clear chart data" button is clicked
//3. Chart title is cleared when "Clear chart data" button is clicked
//4. Chart color is reset when "Clear chart data" button is clicked
//5. STRESS TEST: Again, this is following the video; all values with input fields usable by the user in ui are reset once "Clear chart data" button is clicked (look at modified fields list above)


/*Notes:
-TBH, if I tested each individual part (test for BOTH X and Y input fields OR BOTH X and Y Labels) it would be mostly redundant and tedious. For these reasons I grouped them to one test
*/



test("X and Y values (original) are cleared when clear chart data button is clicked", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    const clearChartData = domTesting.getByRole(document, "button", { name: 'Clear chart data' }) 
    const initialXInputBox = domTesting.getByLabelText(document, "X")
    const initialYInputBox = domTesting.getByLabelText(document, "Y")

    //Act:
    const user = userEvent.setup()
    await user.type(initialXInputBox, "1")
    await user.type(initialYInputBox, "2")
    expect(initialXInputBox).toHaveValue(1)                                               
    expect(initialYInputBox).toHaveValue(2)

    await user.click(clearChartData)  
    //Assert:
    const xValueArray = domTesting.queryAllByLabelText(document, "X")
    const yValueArray = domTesting.queryAllByLabelText(document, "Y")

    expect(xValueArray).toHaveLength(1)                                             //Check that there's only one pair of X/Y value input fields                   
    expect(yValueArray).toHaveLength(1)

    expect(xValueArray[0]).not.toHaveValue()                                        //Testing that the inputs have no value (cleared)                                       
    expect(yValueArray[0]).not.toHaveValue()     

})



test("X and Y values (created by the + button/not original) are cleared when clear chart data button is clicked", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    const clearChartData = domTesting.getByRole(document, "button", { name: 'Clear chart data' }) 
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 

    //Act:
    const user = userEvent.setup()

    await user.click(addValueButton)                              

    const xValueArray = domTesting.getAllByLabelText(document, "X")
    const yValueArray = domTesting.getAllByLabelText(document, "Y")

    await user.type(xValueArray[0], "1")
    await user.type(yValueArray[0], "2")
    
    await user.type(xValueArray[1], "3")
    await user.type(yValueArray[1], "4")

    expect(xValueArray[0]).toHaveValue(1)                                               
    expect(yValueArray[0]).toHaveValue(2)
    
    expect(xValueArray[1]).toHaveValue(3)                                               
    expect(yValueArray[1]).toHaveValue(4)

    await user.click(clearChartData)  

    //Assert:
    const xValueArrayFinal = domTesting.queryAllByLabelText(document, "X")
    const yValueArrayFinal = domTesting.queryAllByLabelText(document, "Y")

    expect(xValueArrayFinal).toHaveLength(1)                                        //Both fields should clear (change from length 2 to 1)                
    expect(yValueArrayFinal).toHaveLength(1)

    expect(xValueArrayFinal[0]).not.toHaveValue()                                                                             
    expect(yValueArrayFinal[0]).not.toHaveValue() 

})

test("X and Y labels are cleared when clear chart data button is clicked", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)
    
    //Arrange:
    const clearChartData = domTesting.getByRole(document, "button", { name: 'Clear chart data' }) 
    const XLabelBox = domTesting.getByLabelText(document, "X label")
    const YLabelBox = domTesting.getByLabelText(document, "Y label")

    //Act:
    const user = userEvent.setup()
    await user.type(XLabelBox, "A")
    await user.type(YLabelBox, "B")
    expect(XLabelBox).toHaveValue("A")                                               
    expect(YLabelBox).toHaveValue("B")

    await user.click(clearChartData)  
    //Assert:

    expect(XLabelBox).not.toHaveValue()
    expect(YLabelBox).not.toHaveValue()     
    //Assert:

})

test("Chart title is cleared when clear chart data button is clicked", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    const clearChartData = domTesting.getByRole(document, "button", { name: 'Clear chart data' }) 
    const chartTitle = domTesting.getByLabelText(document, "Chart title")


    //Act:
    const user = userEvent.setup()
    await user.type(chartTitle, "Cats vs Dogs")
    expect(chartTitle).toHaveValue("Cats vs Dogs")  
    await user.click(clearChartData)

    //Assert:
    expect(chartTitle).not.toHaveValue()

})

test("Chart color is reset when clear chart data button is clicked", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    const clearChartData = domTesting.getByRole(document, "button", { name: 'Clear chart data' }) 
    const colorInputElement = domTesting.getByLabelText(document, 'Chart color')

    //Act:  
    const user = userEvent.setup()
    domTesting.fireEvent.input(colorInputElement, {target: {value: '#2743f5'}})     //Just like the person on piazza, I couldn't get the color to work in any other way than
    expect(colorInputElement.value).toBe('#2743f5');                                //using FireEvent. This would not be how the user interacts with the ui but I couldn't find any other way.
    
    await user.click(clearChartData)

    //Assert:
    expect(colorInputElement.value).toBe('#ff4500');                                //The color doesn't "reset", but rather gets set to the same chosen value each time.
})


test("All data from all possible ui interfaces are cleared when clear chart data button is clicked", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    const clearChartData = domTesting.getByRole(document, "button", { name: 'Clear chart data' }) 
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 
    const XLabelBox = domTesting.getByLabelText(document, "X label")
    const YLabelBox = domTesting.getByLabelText(document, "Y label")
    const chartTitle = domTesting.getByLabelText(document, "Chart title")
    const colorInputElement = domTesting.getByLabelText(document, 'Chart color')

    //Act:
    const user = userEvent.setup()
    await user.type(XLabelBox, "A")
    await user.type(YLabelBox, "B")
    expect(XLabelBox).toHaveValue("A")                                               
    expect(YLabelBox).toHaveValue("B")

    await user.type(chartTitle, "Cats vs Dogs")
    expect(chartTitle).toHaveValue("Cats vs Dogs") 

    await user.click(addValueButton)
    await user.click(addValueButton)
    await user.click(addValueButton)
    await user.click(addValueButton)
    await user.click(addValueButton)

    const xValueArray = domTesting.getAllByLabelText(document, "X")
    const yValueArray = domTesting.getAllByLabelText(document, "Y")

    await user.type(xValueArray[0], "1")
    await user.type(yValueArray[0], "3")
    
    await user.type(xValueArray[1], "2")
    await user.type(yValueArray[1], "7")

    await user.type(xValueArray[2], "3")
    await user.type(yValueArray[2], "15")

    await user.type(xValueArray[3], "4")
    await user.type(yValueArray[3], "25")
    
    await user.type(xValueArray[4], "5")
    await user.type(yValueArray[4], "40")

    expect(xValueArray).toHaveLength(6)                                         
    expect(yValueArray).toHaveLength(6)

    expect(xValueArray[0]).toHaveValue(1)                                               
    expect(yValueArray[0]).toHaveValue(3)
    expect(xValueArray[1]).toHaveValue(2)                                               
    expect(yValueArray[1]).toHaveValue(7)
    expect(xValueArray[2]).toHaveValue(3)                                               
    expect(yValueArray[2]).toHaveValue(15)
    expect(xValueArray[3]).toHaveValue(4)                                               
    expect(yValueArray[3]).toHaveValue(25)
    expect(xValueArray[4]).toHaveValue(5)                                               
    expect(yValueArray[4]).toHaveValue(40)
    expect(xValueArray[5]).not.toHaveValue()                                               
    expect(yValueArray[5]).not.toHaveValue()

    domTesting.fireEvent.input(colorInputElement, {target: {value: '#47d5f5'}})     //Video had it set to light blue. This is close enough
    expect(colorInputElement.value).toBe('#47d5f5');        

    await user.click(clearChartData)
    //Assert:

    //check X/Y values are reset
    const xValueArrayFinal = domTesting.queryAllByLabelText(document, "X")
    const yValueArrayFinal = domTesting.queryAllByLabelText(document, "Y")
    expect(xValueArrayFinal).toHaveLength(1)                                         
    expect(yValueArrayFinal).toHaveLength(1)
    expect(xValueArrayFinal[0]).not.toHaveValue()                                               
    expect(yValueArrayFinal[0]).not.toHaveValue()

    //check X/Y labels
    expect(XLabelBox).not.toHaveValue()
    expect(YLabelBox).not.toHaveValue()  

    //Check chart title
    expect(chartTitle).not.toHaveValue()  

    //Check chart color
    expect(colorInputElement.value).toBe('#ff4500');  

})




