function TopSection(eventBus, sel) {
    Common.call(this, eventBus, sel);
}

TopSection.prototype = {
    constructor: TopSection,

    notify: function (eventName) {
        switch (eventName) {
            case BookmarkerEvent.ToggleTopBar:
                this.toggle();
                break;
        }
    },

    toggle: function () {
        this.sel.toggle();
    }
};