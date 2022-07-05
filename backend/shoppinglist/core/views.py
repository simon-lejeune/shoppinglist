from .models import Item, List
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ItemSerializer, ListSerializer


class ListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows lists to be viewed or edited.
    """

    queryset = List.objects.all()
    serializer_class = ListSerializer
    # permission_classes = [permissions.IsAuthenticated]

    @action(detail=True)
    def items(self, request, pk):
        items = Item.objects.filter(list_id=pk)
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows items to be viewed or edited.
    """

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # permission_classes = [permissions.IsAuthenticated]
