var eventBus;
var topSection;
var categoryInpSearch;
var categoryInpAdd;
var bookmarkList;

function BookmarkerEvent() {
}

$(function () {
    eventBus = new BookmarkerEventBus();
    topSection = new TopSection(eventBus, $("#top-wrapper"));

    var categoryListSearch = new CategoryList(eventBus, $("#category_list_search"), 'search');
    categoryInpSearch = new CategoryInput(eventBus, $("#category_inp"), categoryListSearch);
    var categoryListAdd = new CategoryList(eventBus, $("#category_list_add"), 'add');
    categoryInpAdd = new CategoryInput(eventBus, $("#category-box"), categoryListAdd);

    bookmarkList = new BookmarkList(eventBus, $("#bookmarks-list"), categoryListSearch);

    function initSubscriptionObj(subObj, eventString, subscribers) {
        subObj[eventString] = subscribers;
        return eventString;
    }

    var subObj = {};
    BookmarkerEvent.ToggleTopBar = initSubscriptionObj(subObj, "topBar:toggle", [topSection]);
    BookmarkerEvent.CategorySearchAddedOnPage = initSubscriptionObj(subObj, "category:search:added", [bookmarkList]);
    BookmarkerEvent.CategorySearchDeletedOnPage = initSubscriptionObj(subObj, "category:search:deleted", [bookmarkList]);
    BookmarkerEvent.CategoryAddAddedOnPage = initSubscriptionObj(subObj, "category:add:added", []);
    BookmarkerEvent.CategoryAddDeletedOnPage = initSubscriptionObj(subObj, "category:add:deleted", []);
    eventBus.subscribe(subObj);

    eventBus.publish(BookmarkerEvent.ToggleTopBar);
});

$("#add-bookmark").click(function () {
    eventBus.publish(BookmarkerEvent.ToggleTopBar);
});