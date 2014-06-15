function BookmarkList(eventBus, scope, sel, categoryList) {
    Common.call(this, eventBus, scope, sel);
    this.categoryList = categoryList;
}

BookmarkList.prototype = {
    constructor: BookmarkList,

    notify: function (eventName, scope) {
        var _this = this;
        switch (eventName) {
            case BookmarkerEvent.CategoryAddedOnPage:
                if (this.categoryList.scope == scope) {
                    BookmarkRepo.ListByCategory(this.categoryList.getAllCategories())
                        .success(function (output) {
                            _this.sel.html(output);
                        });
                }
                break;
        }
    },

    clear: function () {
        this.sel.html("");
    }
};