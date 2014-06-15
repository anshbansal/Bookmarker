;
function Common(eventBus, scope, sel) {
    this.eventBus = eventBus;
    this.scope = scope;
    this.sel = sel;
}

function objValueInClass(curObj, classString, classIsChild) {
    var result = false;
    var iter = classIsChild ? curObj.sel.find(classString) : $(classString);

    iter.each(function () {
        if (curObj.getVal() == $.trim($(this).text())) {
            result = true;
        }
    });
    return result;
}

function getIdsOfChildren(sel, classString) {
    var ids = [];
    sel.find(classString).each(function () {
        ids.push($(this).attr('class').substr(classString.length));
    });
    return ids.join(',');
}