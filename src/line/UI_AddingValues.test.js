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



//----------------Test 1-----------------//
// Purpose: Simulate and test that the   //
// add values button "+" in the sidebar  //
// correctly functions as intended and   //
// doesn't impact data already entered   //
//---------------------------------------//

/*
Modified fields (after clicking on the + button):
-X value text box is created
-Y value text box is created
-Previous text boxes aren't cleared
*/


//Tests:
//1. Clicking "+" will create a new pair of input fields that are empty; mainly testing for X-input to be created
//2. Clicking "+" will create a new pair of input fields that are empty; mainly testing for Y-input to be created
//3. User can create multiple input fields (coresponding to the number of times clicking "+")
//4. User can input numbers into left field (X) and then create new input field and X variable should remain
//5. User can input numbers into right field (Y) and then create new input field and Y variable should remain
//6. STRESS TEST. User follows exact content from video (Inputs multiple fields one after another) and have data retained; this is basically testing if multiple filled in and blank inputs can be created and work correctly

/*Notes:
-Tests 1 and 2 use getAllBy instead of queryAllBy because it's assumed that one input field labeled X and Y will always exist, therefore nullifying error throw
-Test 6 is essentially mimicking the video from the assignment sheet. It looks soooo bad but I don't know how to code it in a better way without making it seem non-user like in its process.
*/



test("Clicking + will create a new input field labeled X (two in total)", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' })  //set button by visual representation, will click on BUTTON role with name of "+"

    //Act:
    const user = userEvent.setup()      
    await user.click(addValueButton)                                                //just clicking "+" button :/

    const xValueInputs = domTesting.getAllByLabelText(document, "X")                //getAllByLabelText returns array of labels with label text "X", thorws an error if no matches
                                                                                    //using ^^^^^   ... we can count the number of label boxes with "X" and "Y"
    //Assert:
    expect(xValueInputs).toHaveLength(2)                                            //array should have 2, one for initial input field, and one for the created one after clicking "+"                                                                    
    expect(xValueInputs[1]).not.toHaveValue()                                       

})


test("Clicking + will create a new input field labeled Y", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)

    //Arrange:
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' })  

    //Act:
    const user = userEvent.setup()      
    await user.click(addValueButton)                                                

    const yValueInputs = domTesting.getAllByLabelText(document, "Y")                 

    //Assert:
    expect(yValueInputs).toHaveLength(2)                                            
    expect(yValueInputs[1]).not.toHaveValue()                                       //Essentially the same function as above test                                                                  

})


test("Using the add values button multiple times correctly produces equivalent amount of input fields.", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)                         

    //Arrange:
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 

    //Act:
    const user = userEvent.setup()
    await user.click(addValueButton)                                                //Arbitrary amount of clicks (for this specific test clicks = 3)
    await user.click(addValueButton)    
    await user.click(addValueButton)    

    const xValueInputs = domTesting.getAllByLabelText(document, "X")    
    const yValueInputs = domTesting.getAllByLabelText(document, "Y")    

    //Assert:
    expect(xValueInputs).toHaveLength(4)   
    expect(yValueInputs).toHaveLength(4)   

})


test("Inputting an integer into left (X) input field and clicking + button results in no change to the afformentioned integer", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 
    const initialXInputBox = domTesting.getByLabelText(document, "X")               //not getAllBy because there's only one input field (for X) at this point
    
    //Act:
    const user = userEvent.setup()
    await user.type(initialXInputBox, "1")
    await user.click(addValueButton)  

    const xValueArray = domTesting.getAllByLabelText(document, "X")

    //Assert:
    expect(xValueArray).toHaveLength(2)                                             //Once again testing to make sure it initialized correctly
    expect(xValueArray[0]).toHaveValue(1)                                           //first box has 1 in its contents
    expect(xValueArray[1]).not.toHaveValue()                                        //second box is cleared
})


test("Inputting an integer into right (Y) input field and clicking + button results in no change to the afformentioned integer", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 
    const initialYInputBox = domTesting.getByLabelText(document, "Y")               
    
    //Act:
    const user = userEvent.setup()
    await user.type(initialYInputBox, "2")
    await user.click(addValueButton)  

    const yValueArray = domTesting.getAllByLabelText(document, "Y")

    //Assert:
    expect(yValueArray).toHaveLength(2)                                             
    expect(yValueArray[0]).toHaveValue(2)                                           //first box has 2 in its contents
    expect(yValueArray[1]).not.toHaveValue()                                        //second box is cleared
})


test("Inputting integers into multiple input fields and then creating more empty input fields won't erase previous textbox values", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             

    //Arrange:
    const addValueButton = domTesting.getByRole(document, "button", { name: '+' }) 
    const initialXInputBox = domTesting.getByLabelText(document, "X")
    const initialYInputBox = domTesting.getByLabelText(document, "Y")

    //Act:
    const user = userEvent.setup()
    await user.type(initialXInputBox, "1")
    await user.type(initialYInputBox, "2")
    await user.click(addValueButton)

    const secondXInputBox = domTesting.getAllByLabelText(document, "X")
    const secondYInputBox = domTesting.getAllByLabelText(document, "Y")
    await user.type(secondXInputBox[1], "3")
    await user.type(secondYInputBox[1], "4")
    await user.click(addValueButton)

    const thirdXInputBox = domTesting.getAllByLabelText(document, "X")
    const thirdYInputBox = domTesting.getAllByLabelText(document, "Y")
    await user.type(thirdXInputBox[2], "5")
    await user.type(thirdYInputBox[2], "6")

    await user.click(addValueButton)
    await user.click(addValueButton)
    await user.click(addValueButton)

    const xValueArray = domTesting.getAllByLabelText(document, "X")
    const yValueArray = domTesting.getAllByLabelText(document, "Y")

    //Assert:
    expect(xValueArray).toHaveLength(6)                                             // 2 (initial) + 10 (five clicks * 2) = 12 total input boxes. There should be 6 input fields for X and Y each
    expect(yValueArray).toHaveLength(6)    
    
    expect(xValueArray[0]).toHaveValue(1)
    expect(yValueArray[0]).toHaveValue(2)  
    expect(xValueArray[1]).toHaveValue(3)
    expect(yValueArray[1]).toHaveValue(4)  
    expect(xValueArray[2]).toHaveValue(5)
    expect(yValueArray[2]).toHaveValue(6)  

    for(let i = 3; i < 6; ++i){                                                     //Itterates from clicks 3 onward (all should be empty at this point) to make sure they're all blank
        expect(xValueArray[i]).not.toHaveValue()  
        expect(yValueArray[i]).not.toHaveValue()   
    }
})



/*
Format:

test("", async function() {
    initDomFromFiles(`${__dirname}/line.html`,`${__dirname}/line.js`)             
    
    //Arrange:

    //Act:
    const user = userEvent.setup()

    //Assert:

})



Example:

  //Arrange:
    const emailInput = domTesting.getByLabelText(document, "Email")                 //getting email
    const passwordInput = domTesting.getByLabelText(document, "Password")           //getting password
    const registerButton = domTesting.getByRole(document, "button")                 //getting button (assuming it's the only button on the webpage)

    //Act:
    const user = userEvent.setup()
    await user.type(emailInput, "hessro@oregonstate.edu")
    await user.type(passwordInput, "abc123ABC!!!")
    await user.click(registerButton)

    //Assert:
    const displayMessage = domTesting.getByRole(document, "status")

    //check if the success message is correct
    expect(displayMessage).not.toBeNull()
    expect(domTesting.queryByText(displayMessage, "✅ Success")).not.toBeNull()
    expect(domTesting.queryByText(displayMessage, "You have successfully registered.")).not.toBeNull()


*/
