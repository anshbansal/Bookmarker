var eventBus;
var topSection;
var categoryInpSearch;
var categoryListSearch;
var categoryInpAdd;
var categoryListAdd;
var bookmarkList;


$(function () {
    eventBus = new BookmarkerEventBus();
    topSection = new TopSection(eventBus, $("#top-wrapper"));
    topSection.toggle();

    categoryListSearch = new CategoryList(eventBus, $("#category_list_search"));
    categoryInpSearch = new CategoryInput(eventBus, $("#category_inp"), categoryListSearch);
    categoryListAdd = new CategoryList(eventBus, $("#category_list_add"));
    categoryInpAdd = new CategoryInput(eventBus, $("#category-box"), categoryListAdd);

    bookmarkList = new BookmarkList(eventBus, "#bookmarks-list");
});