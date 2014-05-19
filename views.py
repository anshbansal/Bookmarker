from django.shortcuts import render
from django.views import generic

from BookMarker.models import BookMark, Category


class DetailView(generic.DetailView):
    model = BookMark
    template_name = 'BookMarker/detail.html'


def get_category(request):
    return render(request, 'BookMarker/search.html', {
        'categories': Category.objects.all(),
    })