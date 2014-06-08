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
var BOOKMARK_LIST = $("#bookmarks-list");
var CATEGORY_LIST_SEARCH = $("#category_list_search");
var CATEGORY_LIST_ADD = $("#category_list_add");
var BOOKMARK_NAME = $("#bookmark-name");
var CATEGORY_BOX = $("#category-box");
var TOP_WRAPPER = $("#top-wrapper");
var ADD_BOOKMARKS = $("#add-bookmark");

//Variables for event names
var EV_ENTER_KEY = "enterKey";
var EV_ADD_CATEGORY = "addCategory";
var EV_CLICK = "click";
var EV_UPDATE_BOOKMARKS = "updateBookmarks";
var EV_CLEAR_ALL = "clearAll";
var EV_ALT_N = "clickAltN";


//Auxiliary functions
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

function bindEvents(curObj, e) {
    var triggerName = "";
    if (e.keyCode == 13) {
        triggerName = EV_ENTER_KEY;
    } else if (e.altKey && e.keyCode == "N".charCodeAt(0)) {
        triggerName = EV_ALT_N;
    }
    $(curObj).trigger(triggerName);
}

//Action for body Load
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

//Auxiliary functions for categories
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

function addCategory(curObj, categoryList, triggerData) {
    $.ajax({
        url: URL_CATEGORY,
        data: {'value': $(curObj).val()},
        success: function (output) {
            categoryList.append(output);
            $(curObj).val("");
            if (triggerData.trigger_obj !== undefined) {
                triggerData.trigger_obj.trigger(triggerData.next_trig);
            }
        }
    });
}

function deleteCategory(curObj) {
    var categoryId = getClassString(curObj, LEN_DEL_CATEGORY);
    $(CLASS_CATEGORY + "." + categoryId).remove();
}

//Actions common to both category boxes
$("#category_inp,#category-box").on({
    keyup: function (e) {
        bindEvents(this, e);
    },
    "enterKey": function () {
        if (testCategory($(this))) {
            $(this).trigger(EV_ADD_CATEGORY);
        }
    },
    "clearAll": function () {
        $(this).val("");

    }
});

//Actions for Search's category box
CATEGORY_INPUT.on({
    "addCategory": function () {
        addCategory(this, CATEGORY_LIST_SEARCH, {
            trigger_obj: BOOKMARK_LIST,
            next_trig: EV_UPDATE_BOOKMARKS
        });
    }
});

//Actions for Add Bookmark's category box
CATEGORY_BOX.on({
    "addCategory": function () {
        addCategory(this, CATEGORY_LIST_ADD, {});
    }
});

CATEGORY_LIST_SEARCH.on({
    "clearAll": function () {
        $(this).html("");
        BOOKMARK_LIST.trigger(EV_CLEAR_ALL);
    }
});

CATEGORY_LIST_ADD.on({
    "clearAll": function () {
        $(this).html("");
    }
});

//Actions for delete of Category - Search
CATEGORY_LIST_SEARCH.on(EV_CLICK, CLASS_DEL_CATEGORY, function () {
    deleteCategory(this);
    BOOKMARK_LIST.trigger(EV_UPDATE_BOOKMARKS);
});

//Actions for delete of Category - Add
CATEGORY_LIST_ADD.on(EV_CLICK, CLASS_DEL_CATEGORY, function () {
    deleteCategory(this);
});

//Actions for bookmark List
BOOKMARK_LIST.on({
    "updateBookmarks": function () {
        $.ajax({
            url: URL_BOOKMARK_LIST,
            data: {'ids': getAllCategories()},
            success: function (output) {
                BOOKMARK_LIST.html(output);
            }
        });
    },

    "clearAll": function () {
        $(this).html("");
    }
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
    click: function () {
        TOP_WRAPPER.toggle();
        CATEGORY_INPUT.trigger(EV_CLEAR_ALL);
        CATEGORY_LIST_SEARCH.trigger(EV_CLEAR_ALL);
    }
});

//Action for BookMark Name - WIP
BOOKMARK_NAME.on({
    keyup: function (e) {
        bindEvents(this, e);
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