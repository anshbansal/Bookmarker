function BookmarkerEvent() {
}

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

    publish: function (eventName, args) {
        var subscribers = this.subscribers[eventName];
        if (!subscribers) {
            return;
        }
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i].notify(eventName, args);
        }
    }
};


NotificationBar = function (eventBus, sel) {
    Common.call(this, eventBus, sel);
};

NotificationBar.prototype = {
    notify: function (eventName, args) {
        switch (eventName) {
            case BookmarkerEvent.Notify:
                this.showNotification(args.notifyMessage);
                break;
            default:
                console.log(eventName + " not bound");
        }
    },

    hide: function () {
        this.sel.hide();
    },

    showNotification: function (message) {
        var sel = this.sel;
        sel.fadeIn(50, function () {
            setTimeout(function () {
                sel.fadeOut(800);
            }, 3000);
        });
    }
};