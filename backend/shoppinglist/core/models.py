from django.db import models
from django.db.models import Q, CharField
from django.db.models.functions import Length

CharField.register_lookup(Length)


class List(models.Model):
    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(check=Q(name__length__gt=0), name="name_length")
        ]

    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"List {self.name}"


class Item(models.Model):
    class Meta:
        ordering = ["-created_at"]

    list_id = models.ForeignKey("core.List", on_delete=models.CASCADE)
    content = models.CharField(max_length=200)
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Item {self.content} ({self.list_id.name})"
