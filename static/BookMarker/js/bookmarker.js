//Variables for URLs
var URL_CATEGORY_AUTO = "auto/category/";
var URL_BOOKMARK_AUTO = "auto/bookmark/";
var URL_PAGE_OPEN = "open/";
var URL_BOOKMARK_LIST = "bookmarks/";
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
var BOOKMARK_LIST = $("#bookmarks");
var CATEGORY_LIST = $("#category_list");
var BOOKMARK_NAME = $("#bookmark-name");
var BODY_WRAPPER = $("#wrapper");

//Variables for event names
var EV_ENTER_KEY = "enterKey";
var EV_ADD_CATEGORY = "addCategory";
var EV_CLICK = "click";
var EV_UPDATE_BOOKMARKS = "updateBooks";

//Variables for messages
var MSG_NOT_CATEGORY = "Not a category";
var MSG_CATEGORY_ADDED = "Category already added";


//Auxiliary functions
function value_in_selector(value_of, selector) {
    var result = false;
    $(selector).each(function () {
        if (value_of.val() == $.trim($(this).text())) {
            result = true;
        }
    });
    return result;
}

function get_substring(cur_object, cur_attr, start_length) {
    return $(cur_object).attr(cur_attr).substr(start_length);
}

function get_class_string(cur_object, start_length) {
    return get_substring(cur_object, 'class', start_length);
}

function get_all_categories() {
    var class_ids = [];
    $(CLASS_DEL_CATEGORY).each(function () {
        class_ids.push(get_class_string(this, 11));
    });
    return class_ids.join(",");
}

//Action for body Load
$(function () {
    $("#top-wrapper").toggle();
    CATEGORY_INPUT.autocomplete({
        source: URL_CATEGORY_AUTO
    });
    BOOKMARK_NAME.autocomplete({
        source: URL_BOOKMARK_AUTO
    });
});

//Bindings for keys to Search Box
CATEGORY_INPUT.keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger(EV_ENTER_KEY);
    }
});

//Action for Search box Enter press
CATEGORY_INPUT.bind(EV_ENTER_KEY, function () {
    if (value_in_selector(CATEGORY_INPUT, CLASS_UI_MENU_ITEM) == false) {
        alert(MSG_NOT_CATEGORY);
    } else if (value_in_selector(CATEGORY_INPUT, CLASS_CATEGORY) == true) {
        alert(MSG_CATEGORY_ADDED);
        CATEGORY_INPUT.val("");
    } else {
        $(this).trigger(EV_ADD_CATEGORY);
    }
});

//Action for addition of category on page
CATEGORY_INPUT.bind(EV_ADD_CATEGORY, function () {
    $.ajax({
        url: URL_CATEGORY,
        data: {'value': CATEGORY_INPUT.val()},
        success: function (output) {
            CATEGORY_LIST.append(output);
            CATEGORY_INPUT.val("");
            BOOKMARK_LIST.trigger(EV_UPDATE_BOOKMARKS);
        }
    });
});

//Action for click on delete of categories
$(document).on(EV_CLICK, CLASS_DEL_CATEGORY, function () {
    var category_id = get_class_string(this, LEN_DEL_CATEGORY);
    $(CLASS_CATEGORY + "." + category_id).remove();
    BOOKMARK_LIST.trigger(EV_UPDATE_BOOKMARKS);
});

//Action for updating bookmarks
BOOKMARK_LIST.bind(EV_UPDATE_BOOKMARKS, function () {
    $.ajax({
        url: URL_BOOKMARK_LIST,
        data: {'ids': get_all_categories()},
        success: function (output) {
            BOOKMARK_LIST.html(output);
        }
    });
});

//Action for click on bookmarks
$(document).on(EV_CLICK, CLASS_BOOKMARK, function () {
    $.ajax({
        url: URL_PAGE_OPEN,
        data: {'id': get_class_string(this, LEN_BOOK_CATEGORY)}
    });
});

$(document).on(EV_CLICK, ".add-category", function() {
    BODY_WRAPPER.toggleClass("padding-wrapper");
    $("#top-wrapper").toggle();
});