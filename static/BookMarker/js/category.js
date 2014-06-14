;
function CategoryInput(eventBus, sel, categoryList) {
    this.eventBus = eventBus.subscribe(this);
    this.sel = sel;
    this.categoryList = categoryList;
}

CategoryInput.prototype = {
    constructor: CategoryInput,
    notify: function (event) {
    },
    getVal: function () {
        return this.sel.val();
    },
    clear: function () {
        this.sel.val("");
    }
};


function CategoryList(eventBus, sel) {
    this.eventBus = eventBus.subscribe(this);
    this.sel = sel;
    this.categories = {};
}

CategoryList.prototype = {
    constructor: CategoryList,
    notify: function (event) {
    },
    clear: function () {
        this.sel.html("");
    }
};