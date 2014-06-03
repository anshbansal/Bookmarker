from django.conf.urls import patterns, url

from BookMarker import views

urlpatterns = patterns('',
    # Returns categories by like search param(term)
    url(r'^search/auto/', views.category_autocomplete, name='category_autocomplete'),
    # Server opens web pages by ID param(id)
    url(r'^search/open/', views.website_open, name='website_open'),
    url(r'^search/bookmarks/', views.get_bookmarks, name='get_bookmarks'),
    url(r'^search/category/', views.get_category, name='get_category'),
    url(r'^search/$', views.search),
    url(r'^add/auto/', views.bookmark_autocomplete, name='bookmark_autocomplete'),
    url(r'^add/$', views.add),
)