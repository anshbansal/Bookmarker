;
function BookmarkList(eventBus, sel) {
    this.eventBus = eventBus.subscribe(this);
    this.sel = sel;
}

BookmarkList.prototype = {
    constructor: BookmarkList,
    notify: function (event) {
    },
    clear: function () {
        this.sel.html("");
    }
};