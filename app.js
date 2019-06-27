//ES5

//Budget Controller
let budgetCtrl = (function () {
})();



//In order for this object's functions to be used in another function/object, we need to use return, to break the IIFE scope and return a public function.

//getUserInput
//The function returns an object that holds a method that returns three DOM properties.
let uiCtrl = (function () {

    //Business practice, store strings in object variables, preferrably private, so if a change arises, it'll be minor.
    let DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputAmt: '.add__value',
        addBtn: '.add__btn'

    }

    //Here's  something to remember
    //Here is an example of returning an object that contains a method, inside thid method, it  returns a function object that returns the DOMString object aboveand stores them as properties.

    return {
        getUserInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                desc: document.querySelector(DOMstrings.inputDesc).value,
                amt: document.querySelector(DOMstrings.inputAmt).value
            }
        },

        //getter
        getDOMStrings: function () {
            return DOMstrings;
        }

    }

})();


let linkCtrl = (function (budget, ui) {

    //gets the stored strings from the created object in the UI controller.
    let uiStrings = ui.getDOMStrings();

    //Store DOM Listeners Here
    //We wrapped the event listeners inside a function expression
    //Added listener for enter button.

    let runEvents = function () {
        document.querySelector(uiStrings.addBtn).addEventListener('click', additem)
        document.querySelector(uiStrings.addBtn).addEventListener('keypress', function () {
            //Check for enter key pressed
            if (event.which === 13 || event.keyCode === 13) {
                addItem();
            }
        })
    }

    let addItem = function () {
        //What needs to be done when button is clicked.
        //1. Get the input data
        const input = ui.getUserInput();

        //2. Add item to budgetCtrl

        
        //3. Add item to UI
        //4. Calc the budget amount.
        //5. Display budget in the UI.
    }

    //Return DOM as a public method
    //Now we need to call the method init outside the IIFE to have the program actually do something.
    return {
        init: function () {
            console.log('Start App')
            runEvents();
        }
    }
})(budgetCtrl, uiCtrl);


linkCtrl.init();