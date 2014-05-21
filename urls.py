from django.conf.urls import patterns, url

from BookMarker import views

urlpatterns = patterns('',
    url(r'^(?P<pk>\d+)/$', views.DetailView.as_view(), name='detail'),
    url(r'^search/auto/', views.category_autocomplete, name='category_autocomplete'),
    url(r'^search/$', views.get_category),
)