from .models import Item, List
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import ItemSerializer, ListSerializer


class ListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows lists to be viewed or edited.
    """

    queryset = List.objects.all()
    serializer_class = ListSerializer
    # permission_classes = [permissions.IsAuthenticated]


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows items to be viewed or edited.
    """

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # permission_classes = [permissions.IsAuthenticated]
