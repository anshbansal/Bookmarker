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

function initSelector(uniqueId, customId) {
    var selector = $(uniqueId);
    selector.attr('customId', customId);
    return selector;
}
//TODO Auxiliary functions - END
//TODO Controller functions - START
//Variables for Events
var EV_CLICK = "click";

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

function callClear(e, curObj) {
    switch (curObj.attr("customId")) {
        case strCategoryInput:
        case strCategoryBox:
            curObj.val("");
            break;
        case strCategoryListSearch:
            callClear(e, BOOKMARK_LIST);
        case strCategoryListAdd:
        case strBookmarkList:
            curObj.html("");
            break;
        default:
            alert("callClear NONE");
    }
}

function callUpdateBookList(e, curObj) {
    switch (curObj.attr("customId")) {
        case strBookmarkList:
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

function callEnterEvent(e, curObj) {
    switch (curObj.attr("customId")) {
        case strCategoryInput:
        case strCategoryBox:
            if (testCategory(curObj)) {
                callAddCategory(e, curObj);
            }
            break;
        default:
            alert("callEnterEvent NONE");
    }
}

function callAddCategory(e, curObj) {
    switch (curObj.attr("customId")) {
        case strCategoryInput:
            addCategory(e, curObj, {
                cat_list: CATEGORY_LIST_SEARCH,
                event_sel: BOOKMARK_LIST
            });
            break;
        case strCategoryBox:
            addCategory(e, curObj, {
                cat_list: CATEGORY_LIST_ADD
            });
            break;
        default:
            alert("callAddCategory NONE");
    }
}

function bindEvents(e, curObj) {
    if (e.keyCode == 13) {
        callEnterEvent(e, curObj);
    } else if (e.altKey && e.keyCode == "N".charCodeAt(0)) {
    }
}

//TODO Controller functions - END
//TODO Body Load - START
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
            if (data.event_sel !== undefined) {
                callUpdateBookList(e, data.event_sel);
            }
        }
    });
}

function deleteCategory(curObj) {
    var categoryId = getClassString(curObj, LEN_DEL_CATEGORY);
    $(CLASS_CATEGORY + "." + categoryId).remove();
}
//TODO Auxiliary functions for categories - END

$("#category_inp,#category-box,#bookmark-name").on({
    keyup: function (e) {
        bindEvents(e, $(this));
    }}
);

//Actions for delete of Category - Search
CATEGORY_LIST_SEARCH.on(EV_CLICK, CLASS_DEL_CATEGORY, function (e) {
    deleteCategory(this);
    callUpdateBookList(e, BOOKMARK_LIST)
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
ADD_BOOKMARKS.on(
    'click', function (e) {
        bindEvents(e, ADD_BOOKMARKS);
        TOP_WRAPPER.toggle();
        callClear(e, CATEGORY_INPUT);
        callClear(e, CATEGORY_LIST_SEARCH);
    }
);