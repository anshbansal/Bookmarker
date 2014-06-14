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

//Auxiliary Functions
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

function initSelector(uniqueId, customId) {
    var selector = $(uniqueId);
    selector.attr('customId', customId);
    return selector;
}

//Variables for selector Strings
var strCategoryInput = 'CATEGORY_INPUT';
var strCategoryListSearch = 'CATEGORY_LIST_SEARCH';
var strTopWrapper = 'TOP_WRAPPER';
var strBookmarkName = 'BOOKMARK_NAME';
var strCategoryBox = 'CATEGORY_BOX';
var strCategoryListAdd = 'CATEGORY_LIST_ADD';
var strAddBookmarks = 'ADD_BOOKMARKS';
var strBookmarkList = 'BOOKMARK_LIST';

//Variables for selectors
var CATEGORY_INPUT = initSelector("#category_inp", strCategoryInput);
var CATEGORY_LIST_SEARCH = initSelector("#category_list_search", strCategoryListSearch);
var TOP_WRAPPER = initSelector("#top-wrapper", strTopWrapper);
var BOOKMARK_NAME = initSelector("#bookmark-name", strBookmarkName);
var CATEGORY_BOX = initSelector("#category-box", strCategoryBox);
var CATEGORY_LIST_ADD = initSelector("#category_list_add", strCategoryBox);
var ADD_BOOKMARKS = initSelector("#add-bookmark", strAddBookmarks);
var BOOKMARK_LIST = initSelector("#bookmarks-list", strBookmarkList);

//Controller functions - START
function eventClear(curObj) {
    var customId = curObj.attr("customId");
    switch (customId) {
        case strCategoryInput:
        case strCategoryBox:
            curObj.val("");
            break;
        case strCategoryListSearch:
            eventClear(BOOKMARK_LIST);
        case strCategoryListAdd:
        case strBookmarkList:
            curObj.html("");
            break;
        default:
            alert("eventClear for " + customId + " Not Bound");
    }
}

function eventEnter(e, curObj) {
    var customId = curObj.attr("customId");
    switch (customId) {
        case strCategoryInput:
        case strCategoryBox:
            if (testCategory(curObj)) {
                eventAddCategory(curObj);
            }
            break;
        default:
            alert("eventEnter for " + customId + " Not Bound");
    }
}

function eventAddCategory(curObj) {
    var customId = curObj.attr("customId");
    switch (customId) {
        case strCategoryInput:
            addCategory(curObj, CATEGORY_LIST_SEARCH, updateBookmarks);
            break;
        case strCategoryBox:
            addCategory(curObj, CATEGORY_LIST_ADD, null);
            break;
        default:
            alert("eventAddCategory for " + customId + " Not Bound");
    }
}

function eventClick(e, curObj) {
    var customId = curObj.attr("customId");
    switch (customId) {
        case strAddBookmarks:
            bindEvents(e, ADD_BOOKMARKS);
            TOP_WRAPPER.toggle();
            eventClear(CATEGORY_INPUT);
            eventClear(CATEGORY_LIST_SEARCH);
            break;
        default:
            alert("eventClick for " + customId + " Not Bound");
    }
}

function bindEvents(e, curObj) {
    if (e.keyCode == 13) {
        eventEnter(e, curObj);
    } else if (e.altKey && e.keyCode == "N".charCodeAt(0)) {
    }
}

$(function () {
    TOP_WRAPPER.hide();

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

//Auxiliary functions for Categories - START
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

function addCategory(curObj, list_update, func) {
    $.ajax({
        url: URL_CATEGORY,
        data: {'value': $(curObj).val()},
        success: function (output) {
            list_update.append(output);
            $(curObj).val("");
            if (func !== null) {
                func();
            }
        }
    });
}

function deleteCategory(curObj) {
    var categoryId = getClassString(curObj, LEN_DEL_CATEGORY);
    $(CLASS_CATEGORY + "." + categoryId).remove();
}

//Auxiliary functions for Bookmarks
function updateBookmarks() {
    $.ajax({
        url: URL_BOOKMARK_LIST,
        data: {'ids': getAllCategories()},
        success: function (output) {
            BOOKMARK_LIST.html(output);
        }
    });
}

//jQuery for binding events and delegating events START
$("#category_inp,#category-box,#bookmark-name,#add-bookmark").on("keyup", function (e) {
        bindEvents(e, $(this));
    }
);

$("#add-bookmark").on("click", function (e) {
        eventClick(e, $(this));
    }
);

//TODO Find a way to refactor this event delegation properly
//Actions for delete of Category - Search
CATEGORY_LIST_SEARCH.on("click", CLASS_DEL_CATEGORY, function (e) {
    deleteCategory(this);
    updateBookmarks();
});

//Actions for delete of Category - Add
CATEGORY_LIST_ADD.on("click", CLASS_DEL_CATEGORY, function (e) {
    deleteCategory(this);
});

//Actions for Bookmark
BOOKMARK_LIST.on("click", CLASS_BOOKMARK, function (e) {
    $.ajax({
        url: URL_PAGE_OPEN,
        data: {'id': getClassString(this, LEN_BOOK_CATEGORY)}
    });
});