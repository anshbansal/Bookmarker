;
function TopSection(eventBus, sel) {
    this.eventBus = eventBus;
    this.sel = sel;
}

TopSection.prototype = {
    constructor: TopSection,

    notify: function (eventName) {
        switch (eventName) {
            case BookmarkerEvent.ToggleVisibility:
                this.toggle();
                break;
        }
    },

    toggle: function () {
        this.sel.toggle();
    }
};