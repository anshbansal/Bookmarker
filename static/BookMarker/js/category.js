;
function CategoryInput(eventBus, sel, categoryList) {
    this.eventBus = eventBus;
    this.sel = sel;
    this.categoryList = categoryList;
}

CategoryInput.prototype = {
    constructor: CategoryInput,

    notify: function (eventName) {
        switch (eventName) {

        }
    },

    getVal: function () {
        return this.sel.val();
    },

    clear: function () {
        this.sel.val("");
    }
};


function CategoryList(eventBus, sel) {
    this.eventBus = eventBus;
    this.sel = sel;
    this.categories = {};
}

CategoryList.prototype = {
    constructor: CategoryList,

    notify: function (eventName) {
        switch (eventName) {

        }
    },

    clear: function () {
        this.sel.html("");
    }
};