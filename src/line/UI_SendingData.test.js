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
    require(jsPath)
}




//const chartBuilder = require("../chartBuilder/chartBuilder") //this is for the spy in Test 2   **EDIT: changed it to using window so I no longer need this


beforeEach(function() {
    window.localStorage.clear()
    window.alert = jest.fn();
})


//----------------Test 4-----------------//
// Purpose: Verify that the data sent    //
// to the chart generating function is   //
// correct. This does not require the    //
// validation of the graph image made    //
//---------------------------------------//

/*
Modified fields (after clicking on "Generate chart"):
-Info being sent to the generateChartImg function
*/


//Tests:
//1. Only one test, check to see that data (Chart type, X/Y values, X/Y labels, chart title, chart color) is sent to generateChartImg and a valid image url



/*Notes:
-I added functionality within the mockImplementation simply to quickly test all of the x/y values (since I'd rather not include a ton of if statements)
-Had to do assertion through getElementByID, because I found it impossible to get the image url from the site while also being able to predict it
*/



test("Data is correctly transferred from the UI elements to the generateChartImg function", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    jest.mock("../lib/generateChartImg.js")
    const generateChartImgSpy = require("../lib/generateChartImg.js")

    const generateChart = domTesting.getByRole(document, "button", { name: 'Generate chart' }) 
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 
    const XLabelBox = domTesting.getByLabelText(document, "X label")
    const YLabelBox = domTesting.getByLabelText(document, "Y label")
    const chartTitle = domTesting.getByLabelText(document, "Chart title")
    const colorInputElement = domTesting.getByLabelText(document, 'Chart color')

    /*   This is the data I'm basing this specific test on:
    const data = [
        { x: 0, y: 0 },
        { x: 10, y: 5 },
        { x: 20, y: 10 },
    ]
    const type = "line"
    const xlabel = "Cats"
    const ylabel = "Dogs"
    const title = "Cats vs Dogs"
    const color = "#47d5f5"
    */

    generateChartImgSpy.mockImplementation(function(type, data, xlabel, ylabel, title, color){
        //This is the stub. We can write what we want to happen when the function generates
        let xDataValidity = true
        let yDataValidity = true
        for(let i = 0; i < 3; ++i){                                                     //Need to check that each of the x/y values are what I pre-set them as for this test
            let xValue = 10 * i
            let yValue = 5 * i
            //console.log(`TEST at Index: ${i} where at this specific point dataX is == ${data[i].x} and calculated xValue is ${xValue}`)                   //This was for testing to make sure the values were actually what I expected them to be and passing
            //console.log(`TEST at Index: ${i} where at this specific point dataY is == ${data[i].y} and calculated yValue is ${yValue}`)
            if(data[i].x != xValue) {
                xDataValidity = false
                break
            }
            
              // Check y values
            if(data[i].y != yValue) {
                yDataValidity = false
                break
            }
        }/*
        if(xDataValidity === true){                                                     //This is testing to see which variable types passed/failed bc my test kept returning bad and I didn't know which was failing
            return("http://placekitten.com/480/480")  
        }
        */
        if(type === "line" && xDataValidity === true && yDataValidity === true && xlabel === "Cats" && ylabel === "Dogs" && title === "Cats vs Dogs" && color == "#47d5f5"){            
            return("http://placekitten.com/480/480")                                    //return any valid image url. This specific url shows that the test was correct
        }
        else{
            return("http://placekittenNOTCORRECT.com/480/480")  
        }

    })

    //Act:
    const user = userEvent.setup()
    await user.type(XLabelBox, "Cats")
    await user.type(YLabelBox, "Dogs")
    expect(XLabelBox).toHaveValue("Cats")                                               
    expect(YLabelBox).toHaveValue("Dogs")

    await user.type(chartTitle, "Cats vs Dogs")
    expect(chartTitle).toHaveValue("Cats vs Dogs") 

    domTesting.fireEvent.input(colorInputElement, {target: {value: '#47d5f5'}})     
    expect(colorInputElement.value).toBe('#47d5f5');   
    
    await user.click(addValueButton)
    await user.click(addValueButton)

    const xValueArray = domTesting.getAllByLabelText(document, "X")
    const yValueArray = domTesting.getAllByLabelText(document, "Y")

    await user.type(xValueArray[0], "0")
    await user.type(yValueArray[0], "0")
    
    await user.type(xValueArray[1], "10")
    await user.type(yValueArray[1], "5")

    await user.type(xValueArray[2], "20")
    await user.type(yValueArray[2], "10")

    expect(xValueArray).toHaveLength(3)                                         
    expect(yValueArray).toHaveLength(3)

    expect(xValueArray[0]).toHaveValue(0)                                               
    expect(yValueArray[0]).toHaveValue(0)
    expect(xValueArray[1]).toHaveValue(10)                                               
    expect(yValueArray[1]).toHaveValue(5)
    expect(xValueArray[2]).toHaveValue(20)                                               
    expect(yValueArray[2]).toHaveValue(10)

    await user.click(generateChart)

    //Assert:
    const displayedImgUrl = document.getElementById("chart-img").src                    //I know this isn't what a user would do, but this test is supposed to validate the data being passed, not the image returned.
    expect(displayedImgUrl).not.toBeNull()                                              //This is just the best way I could think of for validating return differences for the generateChartImg function (since it returns an image)
    expect(displayedImgUrl).toEqual("http://placekitten.com/480/480")                   
})