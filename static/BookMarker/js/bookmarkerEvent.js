;
function BookmarkerEventBus() {
    this.subscribers = {};
}

BookmarkerEventBus.prototype = {
    constructor: BookmarkerEventBus,

    subscribe: function (elem, events) {
        for (var i = 0; i < events.length; i++) {
            this._addListener(this.subscribers[events[i]], elem);
        }
    },

    _addListener: function (subList, sub) {
        if (!subList) {
            subList = [];
        }
        subList.push(sub);
    },

    publish: function (eventName) {
        var subscribers = this.subscribers[eventName];
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i].notify(eventName);
        }
    }
};