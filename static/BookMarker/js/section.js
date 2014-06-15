function TopSection(eventBus, scope, sel) {
    this.eventBus = eventBus;
    this.scope = scope;
    this.sel = sel;
}

TopSection.prototype = {
    constructor: TopSection,

    notify: function (eventName, scope) {
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