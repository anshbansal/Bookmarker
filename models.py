from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class BookMark(models.Model):
    name = models.CharField(max_length=50)
    url_content = models.CharField(max_length=500)
    category = models.ManyToManyField(Category)

    def __str__(self):
        return self.name