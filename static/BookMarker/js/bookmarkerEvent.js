function BookmarkerEventBus() {
    this.subscribers = {};
}

BookmarkerEventBus.prototype = {
    constructor: BookmarkerEventBus,

    subscribe: function (obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var eventName = keys[i];
            var subList = obj[eventName];
            for (var j = 0; j < subList.length; j++) {
                this._addListener(this.subscribers, eventName, subList[j]);
            }
        }
    },

    _addListener: function (sel, eventName, elem) {
        if (!sel[eventName]) {
            sel[eventName] = [];
        }
        sel[eventName].push(elem);
    },

    publish: function (eventName) {
        var subscribers = this.subscribers[eventName];
        if (!subscribers) {
            return;
        }
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i].notify(eventName);
        }
    }
};