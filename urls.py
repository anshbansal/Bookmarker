from django.conf.urls import patterns, url

from BookMarker import views

urlpatterns = patterns('',
    # Returns by like search param(term)
    url(r'^auto/category/', views.category_autocomplete, name='category_autocomplete'),
    url(r'^auto/bookmark/', views.bookmark_autocomplete, name='bookmark_autocomplete'),

    # Server opens web pages by ID param(id)
    url(r'^open/', views.website_open, name='website_open'),

    url(r'^bookmarks/', views.get_bookmarks, name='get_bookmarks'),
    url(r'^category/', views.get_category, name='get_category'),
    url(r'^$', views.search),
)