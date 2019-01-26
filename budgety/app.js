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

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    precentege: -1
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

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: total - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the precentege of income that we spent
      if (data.totals.inc > 0) {
        data.precentege = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.precentege = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        precentege: data.precentege
      };
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
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescr).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create html string with placeholder text
      if (type == 'inc') {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Inseert the HTML intro the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function() {
      var fields, fieldsArray;
      fields = document.querySelectorAll(DOMstrings.inputDescr + ', ' + DOMstrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(curent, index, array) {
        curent.value = '';
      });

      fieldsArray[0].focus();
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

  var updateBudget = function() {
    // 1. Update the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    //3. Display the budget on UI
    console.log(budget);
  };

  var ctrAddItem = function() {
    var input, newItem;
    // 1. Get the filed input data
    input = UIController.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the new item on user interface
      UICtrl.addListItem(newItem, input.type);
      // 3.5 Clear the fields
      UICtrl.clearFields();
      // 4. Calculate and update budget
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log('application has started');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
