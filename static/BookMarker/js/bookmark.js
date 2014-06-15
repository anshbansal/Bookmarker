function BookmarkList(eventBus, scope, sel, categoryList) {
    Common.call(this, eventBus, scope, sel);
    this.categoryList = categoryList;
}

BookmarkList.prototype = {
    constructor: BookmarkList,

    notify: function (eventName, scope) {
        switch (eventName) {
            case BookmarkerEvent.CategoryAddedOnPage:
            case BookmarkerEvent.CategoryDeletedOnPage:
                this.isCurrentList(scope) && this.updateBookmarks();
                break;
        }
    },

    clear: function () {
        this.sel.html("");
    },

    isCurrentList: function (scope) {
        return this.categoryList.scope == scope;
    },

    updateBookmarks: function () {
        var sel = this.sel;
        BookmarkRepo.ListByCategory(this.categoryList.getAllCategories())
            .success(function (output) {
                sel.html(output);
            });
    }
};