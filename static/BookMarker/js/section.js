;
function TopSection(eventBus, sel) {
    this.eventBus = eventBus.subscribe(this);
    this.sel = sel;
}

TopSection.prototype = {
    constructor: TopSection,
    notify: function (event) {
    },
    toggle: function () {
        this.sel.toggle();
    }
};