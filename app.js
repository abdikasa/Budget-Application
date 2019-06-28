//ES5

//Budget Controller
let budgetCtrl = (function () {

    let Expense = function (desc, value, id) {
        this.desc = desc;
        this.value = value;
        this.id = id;
    }

    let Income = function (desc, value, id) {
        this.desc = desc;
        this.value = value;
        this.id = id;
    }

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function (type, desc, value) {
            let newItem, id;
            //Create ID
            //id = data.allItems['exp' || 'inc'][index]
            //Check if an array is empty first.

            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            //Determine which array income or  expenses
            //Create a new object
            if (type === 'exp') {
                newItem = new Expense(desc, value, id);
            } else if (type === 'inc') {
                newItem = new Income(desc, value, id);
            }

            //Store the objects in their parent container. Then return the object.
            //remember arrays can be accesedlike array["hello"] === array.hello
            data.allItems[type].push(newItem);
            return newItem;
        },

        toStringObj: function () {
            console.log(data);
        }
    }



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
        addBtn: '.add__btn',
        incList: '.income__list',
        expList: '.expenses__list'

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
        },

        addItemToUI: function (obj, type) {
            var html, newHTML, which;
            //HTML strings placeholder text

            if (type === 'inc') {
                which = DOMstrings.incList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                which = DOMstrings.expList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace placeholder with data
            newHTML = html.replace("%id%", obj.id)
            newHTML = newHTML.replace("%desc%", obj.desc)
            newHTML = newHTML.replace("%value%", obj.value)

            //Insert HTML into the DOM 
            document.querySelector(which).insertAdjacentHTML('beforeend', newHTML);
        },

        //Like css, use commas to seperate DOM elements 
        clearFields: function () {
            let fields, fieldArr;

            //Target the description element and the amount field.
            fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputAmt);

            //Convert this array-like object to an actual array object
            //Array.from() is slow.
            fieldArr = Array.prototype.slice.call(fields);
            fieldArr.forEach(function (item) {
                item.value = "";
            })
            //Returns focus to the description input tag.
            fieldArr[0].focus();
        }
    }
})();


let linkCtrl = (function (budget, ui) {

    let addItem = function () {
        let input, newItem;
        //What needs to be done when button is clicked.
        //1. Get the input data
        input = ui.getUserInput();

        //2. Add item to budgetCtrl
        newItem = budget.addItem(input.type, input.desc, input.amt);

        //3. Add item to UI
        ui.addItemToUI(newItem, input.type);
        ui.clearFields();
        //4. Calc the budget amount.
        //5. Display budget in the UI.
    }


    //Store DOM Listeners Here
    //We wrapped the event listeners inside a function expression
    //Added listener for enter button.

    let runEvents = function () {
        //gets the stored strings from the created object in the UI controller.
        const uiStrings = ui.getDOMStrings();

        document.querySelector(uiStrings.addBtn).addEventListener('click', addItem);

        document.addEventListener('keyup', function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                addItem();
            }
        });
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