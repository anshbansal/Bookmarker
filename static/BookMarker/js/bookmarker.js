var eventBus;
var topSection;
var categoryInpSearch;
var categoryInpAdd;
var bookmarkList;
var notificationBar;

$(function () {
    eventBus = new BookmarkerEventBus();
    topSection = new TopSection(eventBus, $("#top-wrapper"));
    notificationBar = new NotificationBar(eventBus, $('#notification-bar'));
    notificationBar.hide();

    var searchCategoryEvents = {
        add_: "category:search:added",
        delete_: "category:search:deleted"
    };

    var addCategoryEvents = {
        add_: "category:add:added",
        delete_: "category:add:deleted"
    };

    var categoryListSearch = new CategoryList(eventBus, $("#category_list_search"), searchCategoryEvents);
    categoryInpSearch = new CategoryInput(eventBus, $("#category_inp"), categoryListSearch, false);
    var categoryListAdd = new CategoryList(eventBus, $("#category_list_add"), addCategoryEvents);
    categoryInpAdd = new CategoryInput(eventBus, $("#category-box"), categoryListAdd, true);

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
    BookmarkerEvent.Notify = initSubscriptionObj(subObj, "notify", [notificationBar]);
    eventBus.subscribe(subObj);

    eventBus.publish(BookmarkerEvent.ToggleTopBar, {});
});

$("#add-bookmark").click(function () {
    eventBus.publish(BookmarkerEvent.ToggleTopBar);
});