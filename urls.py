from django.conf.urls import patterns, url

from BookMarker import views

urlpatterns = patterns('',
    # Returns by like search param(term)
    url(r'^auto/category/', views.category_autocomplete, name='category_auto'),
    url(r'^auto/bookmark/', views.bookmark_autocomplete, name='bookmark_auto'),

    # Server opens web pages by ID param(id)
    url(r'^open/', views.website_open, name='website_open'),

    url(r'^service/category/add', views.add_category, name='add_category'),
    url(r'^service/category/delete', views.delete_category, name='delete_category'),

    url(r'^bookmark/category/', views.get_bookmarks, name='get_bookmarks'),
    url(r'^bookmark/name/', views.get_bookmark_by_name, name='get_bookmark_by_name'),
    url(r'^category/', views.get_category, name='get_category'),
    url(r'^$', views.search),
)