from django.conf.urls import patterns, url

from BookMarker import views

urlpatterns = patterns('',
    # Returns categories by like search
    # params - term
    url(r'^search/auto/', views.category_autocomplete, name='category_autocomplete'),
    # Server opens web pages by ID
    # param - id
    url(r'^search/open/', views.website_open, name='website_open'),
    url(r'^search/$', views.get_category),
)