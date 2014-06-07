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
var ID_ADD_BOOKMARK = "#add-bookmark";

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

//Variables for event names
var EV_ENTER_KEY = "enterKey";
var EV_ADD_CATEGORY = "addCategory";
var EV_CLICK = "click";
var EV_UPDATE_BOOKMARKS = "updateBookmarks";
var EV_CLEAR_ALL = "clearAll";

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

function bind_events(cur_obj, e) {
    if (e.keyCode == 13) {
        $(cur_obj).trigger(EV_ENTER_KEY);
    }
}

//Action for body Load
$(function () {
    TOP_WRAPPER.toggle();

    CATEGORY_INPUT.autocomplete({
        source: function (request, response) {
            $.getJSON(URL_CATEGORY_AUTO, { excludes: get_all_categories(), term: CATEGORY_INPUT.val() },
                response);
        }
    });

    CATEGORY_BOX.autocomplete({
        source: function (request, response) {
            $.getJSON(URL_CATEGORY_AUTO, { excludes: get_all_categories(), term: CATEGORY_BOX.val() },
                response);
        }
    });

    BOOKMARK_NAME.autocomplete({
        source: URL_BOOKMARK_AUTO
    });
});

//Auxiliary functions for categories
function get_all_categories() {
    var class_ids = [];
    $(CLASS_DEL_CATEGORY).each(function () {
        class_ids.push(get_class_string(this, 11));
    });
    return class_ids.join(",");
}

function enter_category(category_box, trigger_event, trigger_data) {
    if (value_in_selector(category_box, CLASS_UI_MENU_ITEM) == false) {
        alert(MSG_NOT_CATEGORY);
    } else if (value_in_selector(category_box, CLASS_CATEGORY) == true) {
        alert(MSG_CATEGORY_ADDED);
        category_box.val("");
    } else {
        category_box.trigger(trigger_event, trigger_data);
    }
}

function add_category(cur_obj, e, data) {
    $.ajax({
        url: URL_CATEGORY,
        data: {'value': $(cur_obj).val()},
        success: function (output) {
            data.cat_list.append(output);
            $(cur_obj).val("");
            if (data.trigger_obj !== undefined) {
                data.trigger_obj.trigger(data.next_trig);
            }
        }
    });
}

//Actions for Search's category box
CATEGORY_INPUT.on({
    keyup: function (e) {
        bind_events(this, e);
    },

    "enterKey": function () {
        enter_category($(this), EV_ADD_CATEGORY, [
            {
                cat_list: CATEGORY_LIST_SEARCH,
                trigger_obj: BOOKMARK_LIST,
                next_trig: EV_UPDATE_BOOKMARKS
            }
        ])
    },

    "addCategory": function (e, data) {
        add_category(this, e, data);
    },

    "clearAll": function () {
        $(CLASS_CATEGORY).remove();
        $(this).val("");
        BOOKMARK_LIST.trigger(EV_CLEAR_ALL);
    }
});

//Actions for Add Bookmark's category box
CATEGORY_BOX.on({
    keyup: function (e) {
        bind_events(this, e);
    },

    "enterKey": function () {
        enter_category($(this), EV_ADD_CATEGORY, [
            {
                cat_list: CATEGORY_LIST_ADD,
                trigger_obj: undefined,
                next_trig: undefined
            }
        ])
    },

    "addCategory": function (e, data) {
        add_category(this, e, data);
    }
});

//Actions for bookmark List
BOOKMARK_LIST.on({
    "updateBookmarks": function () {
        $.ajax({
            url: URL_BOOKMARK_LIST,
            data: {'ids': get_all_categories()},
            success: function (output) {
                BOOKMARK_LIST.html(output);
            }
        });
    },

    "clearAll": function () {
        $(this).html("");
    }
});

//Actions for delete of categories
$(document).on(EV_CLICK, CLASS_DEL_CATEGORY, function () {
    var category_id = get_class_string(this, LEN_DEL_CATEGORY);
    $(CLASS_CATEGORY + "." + category_id).remove();
    BOOKMARK_LIST.trigger(EV_UPDATE_BOOKMARKS);
});

//Actions for Bookmark
$(document).on(EV_CLICK, CLASS_BOOKMARK, function () {
    $.ajax({
        url: URL_PAGE_OPEN,
        data: {'id': get_class_string(this, LEN_BOOK_CATEGORY)}
    });
});

//Actions for Show/Hide Bookmark addition screen
$(document).on(EV_CLICK, ID_ADD_BOOKMARK, function () {
    TOP_WRAPPER.toggle();
    CATEGORY_INPUT.trigger(EV_CLEAR_ALL);
});