var eventBus;
var topSection;
var categoryInpSearch;
var categoryInpAdd;
var bookmarkList;

function BookmarkerEvent() {
}
BookmarkerEvent.ToggleTopBar = "topBar:toggle";
BookmarkerEvent.CategoryAddedOnPage = "category:added";
BookmarkerEvent.CategoryDeletedOnPage = "category:deleted";

$(function () {
    eventBus = new BookmarkerEventBus();
    topSection = new TopSection(eventBus, 'topBar', $("#top-wrapper"));

    var categoryListSearch = new CategoryList(eventBus, 'sideBar', $("#category_list_search"));
    categoryInpSearch = new CategoryInput(eventBus, 'sideBar', $("#category_inp"), categoryListSearch);
    var categoryListAdd = new CategoryList(eventBus, 'topBar', $("#category_list_add"));
    categoryInpAdd = new CategoryInput(eventBus, 'topBar', $("#category-box"), categoryListAdd);

    bookmarkList = new BookmarkList(eventBus, 'mainBody', $("#bookmarks-list"), categoryListSearch);

    var subObj = {};
    subObj[BookmarkerEvent.ToggleTopBar] = [topSection];
    subObj[BookmarkerEvent.CategoryAddedOnPage] = [bookmarkList];
    subObj[BookmarkerEvent.CategoryDeletedOnPage] = [bookmarkList];
    eventBus.subscribe(subObj);

    eventBus.publish(BookmarkerEvent.ToggleTopBar, '');
});

$("#add-bookmark").click(function () {
    eventBus.publish(BookmarkerEvent.ToggleTopBar, '');
});