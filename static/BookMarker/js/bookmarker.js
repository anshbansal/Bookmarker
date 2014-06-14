//Variables for URLs
var URL_CATEGORY_AUTO = "auto/category/";
var URL_BOOKMARK_AUTO = "auto/bookmark/";
var URL_PAGE_OPEN = "open/";
var URL_BOOKMARK_LIST = "bookmark/category/";
var URL_BOOKMARK_BY_NAME = "bookmark/name/";
var URL_CATEGORY = "category/";

//Variables for selector strings
var CLASS_CATEGORY = ".category";
var CLASS_DEL_CATEGORY = ".delete-cat";
var CLASS_BOOKMARK = ".bookmark";
var CLASS_UI_MENU_ITEM = ".ui-menu-item";

//Variables for getting length of classes
var LEN_DEL_CATEGORY = "delete-cat ".length;
var LEN_BOOK_CATEGORY = "col-md-12 bookmark ".length;

//Variables for selectors
var CATEGORY_INPUT = $("#category_inp");
var CATEGORY_LIST_SEARCH = $("#category_list_search");

var TOP_WRAPPER = $("#top-wrapper");

var BOOKMARK_NAME = $("#bookmark-name");
var CATEGORY_BOX = $("#category-box");
var CATEGORY_LIST_ADD = $("#category_list_add");

var ADD_BOOKMARKS = $("#add-bookmark");
var BOOKMARK_LIST = $("#bookmarks-list");


//TODO Auxiliary functions - START
function valueInSelector(valueOf, selector) {
    var result = false;
    $(selector).each(function () {
        if (valueOf.val() == $.trim($(this).text())) {
            result = true;
        }
    });
    return result;
}

function getClassString(curObj, start) {
    return $(curObj).attr('class').substr(start);
}

//TODO Auxiliary functions - END
//TODO Controller functions - START
var EV_ENTER = "enter";
var EV_ADD_CATEGORY = "addCategory";
var EV_UPDATE_BOOKMARKS = "updateBookmarks";
var EV_CLEAR_ALL = "clearAll";
var EV_CLICK = "click";

function callClear(e, curObj, uniqueId) {
    switch (uniqueId) {
        case 'CATEGORY_INPUT':
        case 'CATEGORY_BOX':
            curObj.val("");
            break;
        case 'CATEGORY_LIST_SEARCH':
            callClear(e, BOOKMARK_LIST, 'BOOKMARK_LIST', EV_CLEAR_ALL);
        case 'CATEGORY_LIST_ADD':
        case 'BOOKMARK_LIST':
            curObj.html("");
            break;
        default:
            alert("callClear NONE");
    }
}

function callUpdateBookList(e, curObj, uniqueId) {
    switch (uniqueId) {
        case 'BOOKMARK_LIST':
            $.ajax({
                url: URL_BOOKMARK_LIST,
                data: {'ids': getAllCategories()},
                success: function (output) {
                    curObj.html(output);
                }
            });
            break;
        default:
            alert("callUpdateBookList NONE");
    }
}

function callEnterEvent(e, curObj, uniqueId) {
    switch (uniqueId) {
        case 'CATEGORY_INPUT':
        case 'CATEGORY_BOX':
            if (testCategory(curObj)) {
                callAddCategory(e, curObj, uniqueId);
            }
            break;
        default:
            alert("callEnterEvent NONE");
    }
}

function callAddCategory(e, curObj, uniqueId) {
    switch (uniqueId) {
        case 'CATEGORY_INPUT':
            addCategory(e, curObj, {
                cat_list: CATEGORY_LIST_SEARCH,
                event_sel: BOOKMARK_LIST,
                event_id: 'BOOKMARK_LIST'
            });
            break;
        case 'CATEGORY_BOX':
            addCategory(e, curObj, {
                cat_list: CATEGORY_LIST_ADD
            });
            break;
        default:
            alert("callAddCategory NONE");
    }
}

function bindEvents(e, curObj, uniqueId) {
    if (e.keyCode == 13) {
        callEnterEvent(e, curObj, uniqueId);
    } else if (e.altKey && e.keyCode == "N".charCodeAt(0)) {
    }
}
//TODO Controller functions - END
//TODO Body Load - START
$(function () {
    TOP_WRAPPER.toggle();

    CATEGORY_INPUT.autocomplete({
        source: function (req, res) {
            $.getJSON(URL_CATEGORY_AUTO, { excludes: getAllCategories(), term: CATEGORY_INPUT.val() },
                res);
        }
    });

    CATEGORY_BOX.autocomplete({
        source: function (req, res) {
            $.getJSON(URL_CATEGORY_AUTO, { excludes: getAllCategories(), term: CATEGORY_BOX.val() },
                res);
        }
    });

    BOOKMARK_NAME.autocomplete({
        source: URL_BOOKMARK_AUTO
    });
});
//TODO Body Load - END
//TODO Auxiliary functions for categories - START
function getAllCategories() {
    var classIds = [];
    $(CLASS_DEL_CATEGORY).each(function () {
        classIds.push(getClassString(this, 11));
    });
    return classIds.join(",");
}

function testCategory(categoryInp) {
    if (valueInSelector(categoryInp, CLASS_UI_MENU_ITEM) == false) {
        alert("Not a category");
    } else if (valueInSelector(categoryInp, CLASS_CATEGORY) == true) {
        alert("Category already added");
        categoryInp.val("");
    } else {
        return true;
    }
    return false;
}

function addCategory(e, curObj, data) {
    $.ajax({
        url: URL_CATEGORY,
        data: {'value': $(curObj).val()},
        success: function (output) {
            data.cat_list.append(output);
            $(curObj).val("");
            if (data.event_id !== undefined) {
                callUpdateBookList(e, data.event_sel, data.event_id);
            }
        }
    });
}

function deleteCategory(curObj) {
    var categoryId = getClassString(curObj, LEN_DEL_CATEGORY);
    $(CLASS_CATEGORY + "." + categoryId).remove();
}
//TODO Auxiliary functions for categories - END

CATEGORY_INPUT.on({
    keyup: function (e) {
        bindEvents(e, $(this), 'CATEGORY_INPUT');
    }
});

CATEGORY_BOX.on({
    keyup: function (e) {
        bindEvents(e, $(this), 'CATEGORY_BOX');
    }
});

//Actions for delete of Category - Search
CATEGORY_LIST_SEARCH.on(EV_CLICK, CLASS_DEL_CATEGORY, function (e) {
    deleteCategory(this);
    callUpdateBookList(e, BOOKMARK_LIST, 'BOOKMARK_LIST')
});

//Actions for delete of Category - Add
CATEGORY_LIST_ADD.on(EV_CLICK, CLASS_DEL_CATEGORY, function () {
    deleteCategory(this);
});

//Actions for Bookmark
BOOKMARK_LIST.on(EV_CLICK, CLASS_BOOKMARK, function () {
    $.ajax({
        url: URL_PAGE_OPEN,
        data: {'id': getClassString(this, LEN_BOOK_CATEGORY)}
    });
});

//Actions for Show/Hide Bookmark addition screen
ADD_BOOKMARKS.on({
    click: function (e) {
        TOP_WRAPPER.toggle();
        callClear(e, CATEGORY_INPUT, 'CATEGORY_INPUT');
        callClear(e, CATEGORY_LIST_SEARCH, 'CATEGORY_LIST_SEARCH');
    }
});

//Action for BookMark Name - WIP
BOOKMARK_NAME.on({
    keyup: function (e) {
        bindEvents(e, $(this), 'BOOKMARK_NAME');
    },

    "enterKey": function () {
        $.ajax({
            url: URL_BOOKMARK_BY_NAME,
            data: {'name': BOOKMARK_NAME.val()},
            success: function (output) {
                for (var category in output) {
                    CATEGORY_BOX.trigger(EV_ADD_CATEGORY);
                }
            }
        })
    }
});