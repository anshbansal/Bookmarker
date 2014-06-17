;
function Common(eventBus, sel) {
    this.eventBus = eventBus;
    this.sel = sel;
}

function objValueInClass(value, curObj, classString, classIsChild) {
    var result = false;
    var iter = classIsChild ? curObj.sel.find(classString) : $(classString);

    iter.each(function () {
        if (value == $.trim($(this).text())) {
            result = true;
        }
    });
    return result;
}

function getIdsOfChildren(sel, classString) {
    var ids = [];
    sel.find(classString).each(function () {
        ids.push(getClassNames(this, classString.length));
    });
    return ids.join(',');
}

function getClassNames(curObj, start) {
    return $(curObj).attr('class').substr(start);
}