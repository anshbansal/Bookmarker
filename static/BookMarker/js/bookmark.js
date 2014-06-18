function BookmarkList(eventBus, sel, categoryList) {
    Common.call(this, eventBus, sel);
    this.categoryList = categoryList;
}

BookmarkList.prototype = {
    constructor: BookmarkList,

    notify: function (eventName, args) {
        switch (eventName) {
            case BookmarkerEvent.CategorySearchAddedOnPage:
            case BookmarkerEvent.CategorySearchDeletedOnPage:
                this.updateBookmarks();
                break;
            default:
                console.log(eventName + " not bound");
        }
    },

    clear: function () {
        this.sel.html("");
    },

    updateBookmarks: function () {
        var sel = this.sel;
        BookmarkRepo.ListByCategory(this.categoryList.getAllCategories())
            .success(function (output) {
                sel.html(output);
                $('.bookmark').click(function () {
                    BookmarkRepo.OpenPage(this);
                });
            });
    }
};