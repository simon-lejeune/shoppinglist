from django.contrib import admin

from .models import List, Item


class ItemInline(admin.TabularInline):
    model = Item


@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ("name", "id", "created_at", "updated_at")
    inlines = [ItemInline]
