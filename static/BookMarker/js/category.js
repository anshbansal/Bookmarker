function CategoryInput(eventBus, sel, categoryList, newCategoryAllowed) {
    Common.call(this, eventBus, sel);
    this.categoryList = categoryList;
    this.newCategoryAllowed = newCategoryAllowed;

    var _this = this;
    this.sel.on("keyup", function (e) {
        if (e.keyCode == 13) {
            _this.addCategoryToPage();
        } else if (e.altKey && e.keyCode == "N".charCodeAt(0)) {
            _this.addNewCategory();
        }
    });

    this.sel.autocomplete({
        source: function (req, res) {
            CategoryRepo.AutoByLike(_this.categoryList.getAllCategories(), _this.getVal(), res);
        }
    });
    this._isAutocompleteOn = true;
}

CategoryInput.prototype = {
    constructor: CategoryInput,

    addCategoryToPage: function () {
        var _this = this;
        if (this.categoryList.testCategory(this)) {
            CategoryRepo.DetailByName(this.getVal()).success(function (output) {
                _this.categoryList.addCategory(output);
                _this.clear();
            });
        }
    },

    addNewCategory: function () {
        this.toggleAutocomplete();
        if (this.newCategoryAllowed) {
            //TODO Pass notification to
            this.eventBus.publish(BookmarkerEvent.Notify, {notifyMessage: "Aseem"});
        }
        this.clear();
        this.toggleAutocomplete();
    },

    getVal: function () {
        return this.sel.val();
    },

    toggleAutocomplete: function () {
        if (this._isAutocompleteOn) {
            this.sel.autocomplete("disable");
        } else {
            this.sel.autocomplete("enable");
        }
    },

    clear: function () {
        this.sel.val("");
    }
};


function CategoryList(eventBus, sel, type) {
    Common.call(this, eventBus, sel);
    this.deleteString = ".delete-cat";
    this.type = type;
}

CategoryList.prototype = {
    constructor: CategoryList,

    addCategory: function (category) {
        var _this = this;
        this.sel.append(category);
        $(this.deleteString).click(function () {
            //TODO Refactor logic for deletion of category
            $(this).closest(".category").remove();
            _this.eventBus.publish(CategoryList.getDeleteEvent(_this.type), {});
        });
        this.eventBus.publish(CategoryList.getAddEvent(this.type), {});
    },

    clear: function () {
        this.sel.html("");
    },

    getAllCategories: function () {
        return getIdsOfChildren(this.sel, this.deleteString);
    },

    testCategory: function (valueSel) {
        var value = valueSel.getVal();
        if (objValueInClass(value, this, ".category", true)) {
            alert("Category already added");
            valueSel.clear();
        } else if (!objValueInClass(value, this, ".ui-menu-item", false)) {
            alert("Not a category");
        } else {
            return true;
        }
        return false;
    }
};

CategoryList.getDeleteEvent = function (type) {
    switch (type) {
        case "search":
            return BookmarkerEvent.CategorySearchDeletedOnPage;
        case "add":
            return BookmarkerEvent.CategoryAddDeletedOnPage;
    }
};

CategoryList.getAddEvent = function (type) {
    switch (type) {
        case "search":
            return BookmarkerEvent.CategorySearchAddedOnPage;
        case "add":
            return BookmarkerEvent.CategoryAddAddedOnPage;
    }
};