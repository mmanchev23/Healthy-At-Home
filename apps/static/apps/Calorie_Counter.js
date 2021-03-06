//Here we store the info collector
const StorageCtrl = (function () {
  return {
    storeItem: function (item) {
      let items;
      //if statment see if there is anything in the storage
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);

        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemStorage: function (itemToDeleteID) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (itemToDeleteID === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    removeAllItems: function () {
      localStorage.removeItem("items");
    },
  };
})();

const ItemCtrl = (function () {
  const Item = function (name, calories) {
    this.id = id.next().value;
    this.calories = calories;
    this.name = name;
  };

  function* genID() {
    let id = 1;
    while (true) {
      yield id++;
    }
  }
  const id = genID();

  const data = {
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
    addItem: function (name, calories) {
      const newItem = new Item(name, parseInt(calories));
      data.items.push(newItem);
      return newItem;
    },
    getTotCalories: function () {
      let cal = 0;
      data.items.forEach((item) => {
        cal += item.calories;
      });
      data.totalCalories = cal;
      return data.totalCalories;
    },
    getItemByID: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItemByID: function (id, name, calories) {
      let updatedItem = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          item.name = name;
          item.calories = parseInt(calories);
          updatedItem = item;
        }
      });
      return updatedItem;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    itemToBeDeleted: function (id) {
      const ids = data.items.map((item) => {
        return item.id;
      });
      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
  };
})();

const UICrtl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}</strong> - <em>${item.calories} calories</em>
              <a href=3"" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          </li>`;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    clearEditState: function () {
      UICrtl.clearInputs();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    getSelectors: function () {
      return UISelectors;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },

    addListItem(item) {
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
      <strong>${item.name}</strong> - <em>${item.calories} calories</em>
      <a href=3"" class="secondary-content">
      <i class="edit-item fa fa-pencil"></i></a>`;
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    clearInputs: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    statusList: function (status) {
      document.querySelector(UISelectors.itemList).style.display = status;
    },

    updateTotCalories: function (totalCal) {
      document.querySelector(UISelectors.totalCalories).innerHTML = totalCal;
    },

    addItemToForm: function () {
      const currentItem = ItemCtrl.getCurrentItem();
      document.querySelector(UISelectors.itemNameInput).value =
        currentItem.name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        currentItem.calories;
      UICrtl.showEditState();
    },

    updateListItem: function (item) {
      const listItems = document.querySelectorAll("#item-list li");
      const listItemsConvert = Array.from(listItems);
      listItemsConvert.forEach((li) => {
        const liID = li.getAttribute("id");
        if (liID === `item-${parseInt(item.id)}`) {
          li.innerHTML = `
            <strong>${item.name}</strong> - <em>${item.calories} calories</em>
            <a href=3"" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },

    removeLiItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    
    removeAllItems: function () {
      const items = document.getElementById("item-list");
      items.innerHTML = "";
    },
  };
})();

const App = (function (ItemCtrl, StorageCtrl, UICrtl) {
  const loadEventListeners = function () {
    const UISelectors = UICrtl.getSelectors();

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", function (e) {
        UICrtl.clearEditState();
        e.preventDefault();
      });

    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", deleteItem);

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItem);

    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };
//Add items
  const itemAddSubmit = function (e) {
    const input = UICrtl.getItemInput();
    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      UICrtl.addListItem(newItem);

      const totalCal = ItemCtrl.getTotCalories();

      UICrtl.updateTotCalories(totalCal);

      UICrtl.statusList("block");

      StorageCtrl.storeItem(newItem);
      //Clear input when press add meal
      UICrtl.clearInputs();
    }

    e.preventDefault();
  };

  //Edit function

  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      //take the list id
      const listID = e.target.parentNode.parentNode.id;

      const listIdArr = listID.split("-");

      const id = parseInt(listIdArr[1]);

      const itemToEdit = ItemCtrl.getItemByID(id);

      ItemCtrl.setCurrentItem(itemToEdit);
      //add item in the form
      UICrtl.addItemToForm();
    }
    e.preventDefault();
  };

  //button update when press the edit button
  const itemUpdateSubmit = function (e) {
    const input = UICrtl.getItemInput();
    const itemId = ItemCtrl.getCurrentItem().id;

    const updatedItemSubmit = ItemCtrl.updateItemByID(
      itemId,
      input.name,
      input.calories
    );

    UICrtl.updateListItem(updatedItemSubmit);

    const totalCal = ItemCtrl.getTotCalories();

    UICrtl.updateTotCalories(totalCal);

    UICrtl.clearEditState();

    StorageCtrl.updateItemStorage(updatedItemSubmit);

    UICrtl.clearInputs();

    e.preventDefault();
  };
  //Delete function
  const deleteItem = function (e) {
    const itemToDeleteID = ItemCtrl.getCurrentItem().id;

    ItemCtrl.itemToBeDeleted(itemToDeleteID);

    UICrtl.removeLiItem(itemToDeleteID);

    const totalCal = ItemCtrl.getTotCalories();

    UICrtl.updateTotCalories(totalCal);

    StorageCtrl.deleteItemStorage(itemToDeleteID);

    UICrtl.clearEditState();

    e.preventDefault();
  };

  const clearAllItem = function (e) {

    ItemCtrl.clearAllItems();

    UICrtl.removeAllItems();

    StorageCtrl.removeAllItems();

    const totalCal = ItemCtrl.getTotCalories();

    UICrtl.updateTotCalories(totalCal);

    UICrtl.statusList("none");

    e.preventDefault();
  };

  return {
    init: function () {

      UICrtl.clearEditState();

      const items = ItemCtrl.getItems();

      const totalCal = ItemCtrl.getTotCalories();

      UICrtl.updateTotCalories(totalCal);

      if (items.length === 0) {
        UICrtl.statusList("none");
      } else {
        UICrtl.populateItemList(items);
      }

      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICrtl);
//Initializing the whole web page 
App.init();