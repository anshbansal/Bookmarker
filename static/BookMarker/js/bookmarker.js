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
    var trigger_name = "";
    if (e.keyCode == 13) {
        trigger_name = EV_ENTER_KEY;
    } else if (e.altKey && e.keyCode == "N".charCodeAt(0)) {
        trigger_name = EV_ALT_N;
    }
    $(cur_obj).trigger(trigger_name);
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

function test_category(category_box) {
    if (value_in_selector(category_box, CLASS_UI_MENU_ITEM) == false) {
        alert(MSG_NOT_CATEGORY);
    } else if (value_in_selector(category_box, CLASS_CATEGORY) == true) {
        alert(MSG_CATEGORY_ADDED);
        category_box.val("");
    } else {
        return true;
    }
    return false;
}

function add_category(cur_obj, cat_list, data) {
    $.ajax({
        url: URL_CATEGORY,
        data: {'value': $(cur_obj).val()},
        success: function (output) {
            cat_list.append(output);
            $(cur_obj).val("");
            if (data.trigger_obj !== undefined) {
                data.trigger_obj.trigger(data.next_trig);
            }
        }
    });
}

function delete_cat(cur_obj) {
    var category_id = get_class_string(cur_obj, LEN_DEL_CATEGORY);
    $(CLASS_CATEGORY + "." + category_id).remove();
}

//Actions common to both category boxes
$("#category_inp,#category-box").on({
    keyup: function (e) {
        bind_events(this, e);
    },
    "enterKey": function () {
        if (test_category($(this))) {
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
        add_category(this, CATEGORY_LIST_SEARCH, {
            trigger_obj: BOOKMARK_LIST,
            next_trig: EV_UPDATE_BOOKMARKS
        });
    }
});

//Actions for Add Bookmark's category box
CATEGORY_BOX.on({
    "addCategory": function () {
        add_category(this, CATEGORY_LIST_ADD, {});
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
    delete_cat(this);
    BOOKMARK_LIST.trigger(EV_UPDATE_BOOKMARKS);
});

//Actions for delete of Category - Add
CATEGORY_LIST_ADD.on(EV_CLICK, CLASS_DEL_CATEGORY, function () {
    delete_cat(this);
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

//Actions for Bookmark
BOOKMARK_LIST.on(EV_CLICK, CLASS_BOOKMARK, function () {
    $.ajax({
        url: URL_PAGE_OPEN,
        data: {'id': get_class_string(this, LEN_BOOK_CATEGORY)}
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
        bind_events(this, e);
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