//ES5

//Budget Controller
let budgetCtrl = (function () {

    let Expense = function (desc, value, id, percentage) {
        this.desc = desc;
        this.value = value;
        this.id = id;

        //will not be defined till later, souse -1.
        this.percentage = -1;
    }

    Expense.prototype.calculatePercentages = function (income) {
        //Formula is taking each object percentage property and dividing it by the total income.
        if (income > 0) {
            this.percentage = Math.round((this.value / income) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercent = function () {
        return this.percentage;
    }

    let Income = function (desc, value, id) {
        this.desc = desc;
        this.value = value;
        this.id = id;
    }

    const data = {
        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percent: -1
    };

    calculateTotal = function (type) {
        let array, sum = 0;
        array = data;
        array.allItems[type].forEach(function (item) {
            sum += item.value;
        })
        array.total[type] = sum;
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
        },

        returnData() {
            return data;
        },

        calculateSum: function () {
            //calculate total income and the expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses

            data.budget = data["total"]["inc"] - data["total"]["exp"];

            //calculate the percentage: so expenses/income rounded down.
            //If expense is added first, percentage is Infinity, since wea re dividing zero.
            //If our total income is > 0, we can safely divide,
            //Otherwise, we want the percentage to remain -1.
            if (data['total']['inc'] > 0) {
                data.percent = Math.round((data["total"]["exp"] / data["total"]["inc"]) * 100);
            } else {
                data.percent = -1;
            }
        },

        getBudget: function () {
            return {
                domINC: data['total']['inc'],
                domEXP: data['total']['exp'],
                domPercent: data.percent,
                domBudget: data.budget
            }
        },

        deleteData: function (type, id) {
            for (let i = 0; i < data.allItems[type].length; i++) {
                if (data.allItems[type][i].id === Number(id)) {
                    data.allItems[type].splice(i, 1);
                    break;
                }
            }
        },

        calculatePercentages: function () {
            data.allItems["exp"].forEach(function (item) {
                item.calculatePercentages(data.total["inc"]);
            })
        },

        getPercent: function () {
            let allPercents = data.allItems["exp"].map(function (item) {
                return item.getPercent();
            })
            return allPercents;
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
        expList: '.expenses__list',
        budgetLbl: '.budget__value',
        incomeLbl: '.budget__income--value',
        expenseLbl: '.budget__expenses--value',
        percentLbl: '.budget__expenses--percentage',
        parent: '.container',
        itemPercent: '.item__percentage'
    }

    //Here's  something to remember
    //Here is an example of returning an object that contains a method, inside thid method, it  returns a function object that returns the DOMString object aboveand stores them as properties.

    //We want to  format a number, the 2nd paramter determiens whether tw prepend the + or - sign.
    let formatValues = function (num, type) {
        let numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split(".");
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' $' + int + '.' + dec;
    }


    return {
        getUserInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                desc: document.querySelector(DOMstrings.inputDesc).value,
                amt: parseFloat(document.querySelector(DOMstrings.inputAmt).value)
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                which = DOMstrings.expList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace placeholder with data
            newHTML = html.replace("%id%", obj.id)
            newHTML = newHTML.replace("%desc%", obj.desc)
            newHTML = newHTML.replace("%value%", formatValues(obj.value))

            //Insert HTML into the DOM 
            document.querySelector(which).insertAdjacentHTML('beforeend', newHTML);
        },

        deleteItemFromUI: function (e) {
            if (e.target.parentElement.classList.contains("item__delete--btn")) {
                e.target.parentElement.parentElement.parentElement.parentElement.remove();
            }
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
        },

        displayBudget: function (obj) {
            let type;
            obj.domBudget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLbl).textContent = formatValues(obj.domBudget, type);

            document.querySelector(DOMstrings.incomeLbl).textContent = formatValues(obj.domINC, 'inc');
            document.querySelector(DOMstrings.expenseLbl).textContent = formatValues(obj.domEXP, 'exp');

            if (obj.domPercent > 0) {
                document.querySelector(DOMstrings.percentLbl).textContent = obj.domPercent + "%";
            } else {
                document.querySelector(DOMstrings.percentLbl).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {
            let domPCT = document.querySelectorAll(DOMstrings.itemPercent);

            let nodeForEach = function (list, callback) {
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            }
            nodeForEach(domPCT, function (curr, index) {
                if (percentages[index] > 0) {
                    curr.textContent = percentages[index];
                } else {
                    curr.textContent = "---"
                }
            })
        }
    }
})();


let linkCtrl = (function (budget, ui) {

    let update = function () {
        //4. Calc the budget amount.
        budget.calculateSum();

        let domBudget = budget.getBudget();
        console.log(domBudget);
        //5. Display budget in the UI.
        ui.displayBudget(domBudget);

    }


    let addItem = function () {
        let input, newItem;
        //What needs to be done when button is clicked.
        //1. Get the input data
        input = ui.getUserInput();

        if (input.desc.length !== 0 && !isNaN(input.amt) && input.amt > 0) {
            //2. Add item to budgetCtrl
            newItem = budget.addItem(input.type, input.desc, input.amt);
            //3. Add item to UI
            ui.addItemToUI(newItem, input.type);
            ui.clearFields();
            update();
            updatePercents();
        }
    }

    let deleteItem = function (e) {
        //console.log(e.target.parentElement.parentElement.parentElement.parentElement);
        let type, id, splitId, idNum;
        id = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (id) {
            //split name from number
            //creates an array separating the indentifier.
            splitId = id.split('-');
            type = splitId[0];
            idNum = splitId[1];

            //1. Delete item from data structure
            budget.deleteData(type, idNum);

            //2. Delete From UI
            ui.deleteItemFromUI(e)

            //3.Update 
            update();
            updatePercents();
        }
    }

    let updatePercents = function () {
        //Calculate percentages
        budget.calculatePercentages();

        //Read percenrages
        let percentages = budget.getPercent();

        //show
        console.log(percentages);
        ui.displayPercentages(percentages);
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

        document.querySelector(ui.getDOMStrings().parent).addEventListener("click", deleteItem);
    }


    //Return DOM as a public method
    //Now we need to call the method init outside the IIFE to have the program actually do something.

    return {
        init: function () {
            console.log('Start App')
            runEvents();
            ui.displayBudget({
                domPercent: -1,
                domINC: 0,
                domBudget: 0,
                domEXP: 0
            })
        }
    }
})(budgetCtrl, uiCtrl);


linkCtrl.init();