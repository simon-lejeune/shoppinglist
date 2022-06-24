from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from ..models import List, Item


class ApiTestCase(APITestCase):
    def test_get_1(self):
        url = reverse("api-lists-list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_2(self):
        url = reverse("api-lists-list")
        list1 = List(name="List1")
        list1.save()
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_3(self):
        list1 = List(name="List1")
        list1.save()
        url = reverse("api-lists-detail", kwargs={"pk": list1.id})
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "List1")

    def test_post_1(self):
        self.assertEqual(List.objects.count(), 0)
        url = reverse("api-lists-list")
        response = self.client.post(url, {"name": "Coucou"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(List.objects.count(), 1)
        url = reverse("api-items-list")
        response = self.client.post(
            url, {"content": "item1", "list_id": List.objects.first().id}
        )
        self.assertEqual(List.objects.first().item_set.count(), 1)

    def test_put_1(self):
        list1 = List(name="List1")
        list1.save()
        item1 = Item(content="item1", list_id=list1)
        item1.save()
        self.assertEqual(item1.is_processed, False)
        url = reverse("api-items-detail", kwargs={"pk": item1.id})
        response = self.client.put(
            url, {"is_processed": True, "list_id": list1.id, "content": "item1"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item1.refresh_from_db()
        self.assertEqual(item1.is_processed, True)

    def test_delete_1(self):
        list1 = List(name="List1")
        list1.save()
        self.assertEqual(List.objects.count(), 1)
        url = reverse("api-lists-detail", kwargs={"pk": list1.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(List.objects.count(), 0)

    def test_delete_2(self):
        url = reverse("api-lists-detail", kwargs={"pk": 999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
