from .models import Item, List
from rest_framework import serializers


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            "id",
            "list_id",
            "content",
            "is_processed",
            "created_at",
            "updated_at",
        ]


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ["id", "name", "created_at", "updated_at"]
