;
function BookmarkList(eventBus, sel) {
    this.eventBus = eventBus;
    this.sel = sel;
}

BookmarkList.prototype = {
    constructor: BookmarkList,

    notify: function (eventName) {
        switch (eventName) {

        }
    },

    clear: function () {
        this.sel.html("");
    }
};