function CategoryInput(eventBus, scope, sel, categoryList) {
    Common.call(this, eventBus, scope, sel);
    this.categoryList = categoryList;

    var _this = this;
    this.sel.on("keyup", function (e) {
        if (e.keyCode == 13) {
            _this.enterKey(e);
        }
    });

    this.sel.autocomplete({
        source: function (req, res) {
            CategoryRepo.AutoByLike(_this.categoryList.getAllCategories(), _this.getVal(), res);
        }
    });
}

CategoryInput.prototype = {
    constructor: CategoryInput,

    enterKey: function (e) {
        var _this = this;
        if (this.testCategory()) {
            CategoryRepo.DetailByName(this.getVal())
                .success(function (output) {
                    _this.categoryList.addCategory(output);
                    _this.clear();
                });
        }
    },

    getVal: function () {
        return this.sel.val();
    },

    clear: function () {
        this.sel.val("");
    },

    testCategory: function () {
        if (! objValueInClass(this, ".ui-menu-item", false)) {
            alert("Not a category");
        } else if (objValueInClass(this, ".category", true)) {
            alert("Category already added");
            this.clear();
        } else {
            return true;
        }
        return false;
    }
};


function CategoryList(eventBus, scope, sel) {
    Common.call(this, eventBus, scope, sel);
    this.deleteString = ".delete-cat";
}

CategoryList.prototype = {
    constructor: CategoryList,

    addCategory: function (category) {
        this.sel.append(category);
        this.eventBus.publish(BookmarkerEvent.CategoryAddedOnPage, this.scope);
    },

    clear: function () {
        this.sel.html("");
    },

    getAllCategories: function () {
        return getIdsOfChildren(this.sel, this.deleteString);
    }
};