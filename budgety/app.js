//Budget controller
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var allExpenses = [];
  var allIncomes = [];

  var totalExpense = 0;

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item base on inc or exp type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if ((type = 'inc')) {
        newItem = new Income(ID, des, val);
      }

      // push it in our data structure
      data.allItems[type].push(newItem);
      // return the new element
      return newItem;
    },
    returnlog: function() {
      console.log(data);
    }
  };
})();

// UIController

var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescr: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn'
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescr).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    getDOMStrings: function() {
      return DOMstrings;
    }
  };
})();

// GLOBAL CCONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputButton).addEventListener('click', ctrAddItem);

    document.addEventListener('keypress', function(e) {
      if (e.key === 13 || event.which === 13) {
        ctrAddItem();
      }
    });
  };

  var ctrAddItem = function() {
    var input, newItem;
    // 1. Get the filed input data
    input = UIController.getInput();

    // 2. Add the item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the new item on user interface
    //4. Calculate the budger
    //5. Display the budget on UI
  };

  return {
    init: function() {
      console.log('application has started');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
