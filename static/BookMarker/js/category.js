function CategoryInput(eventBus, sel, categoryList, categoryModAllow) {
    Common.call(this, eventBus, sel);
    this.categoryList = categoryList;
    this.categoryModAllow = categoryModAllow;

    var _this = this;
    this.sel.on("keyup", function (e) {
        if (e.keyCode == 13) {
            _this.addCategoryToPage();
        } else if (_this.categoryModAllow && e.altKey) {
            if (e.keyCode == "N".charCodeAt(0)) {
                _this.addNewCategory();
            } else if (e.keyCode == "R".charCodeAt(0)) {
                _this.deleteCategory();
            }
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
                _this.categoryList.appendCategory(output);
                _this.clear();
            });
        }
    },

    _modifyCategory: function (funcName) {
        var _this = this;
        this.toggleAutocomplete();
        funcName(this.getVal()).success(function (output) {
            _this.eventBus.publish(BookmarkerEvent.Notify, {notifyMessage: output});
        });
        this.clear();
        this.toggleAutocomplete();
    },

    addNewCategory: function () {
        this._modifyCategory(CategoryRepo.AddCategory);
    },

    deleteCategory: function () {
        this._modifyCategory(CategoryRepo.DeleteCategory);
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


function CategoryList(eventBus, sel, eventDict) {
    Common.call(this, eventBus, sel);
    this.deleteString = ".delete-cat";
    this.eventDict = eventDict;
}

CategoryList.prototype = {
    constructor: CategoryList,

    appendCategory: function (category) {
        var _this = this;
        this.sel.append(category);
        $(this.deleteString).click(function () {
            //TODO Refactor logic for deletion of category
            $(this).closest(".category").remove();
            _this.eventBus.publish(_this.eventDict.delete_, {});
        });
        this.eventBus.publish(_this.eventDict.add_, {});
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