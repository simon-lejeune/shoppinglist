from django.test import TestCase
from django.db.utils import IntegrityError
from .models import List, Item


class ModelsTestCase(TestCase):
    def test_list_1(self):
        """Check required fields
        cannot create a list without name
        """
        with self.assertRaises(IntegrityError):
            list1 = List()
            list1.save()

    def test_list_2(self):
        """Check required fields
        cannot create an item without list
        """
        with self.assertRaises(IntegrityError):
            item1 = Item(content="item1")
            item1.save()

    def test_list_3(self):
        """Check basic list creation"""
        list1 = List(name="List1")
        list1.save()
        self.assertEqual(list1.name, "List1")

    def test_list_4(self):
        """Add some items to a list"""
        list1 = List(name="List1")
        list1.save()
        item1 = Item(content="item1", list_id=list1)
        item1.save()
        item2 = Item(content="item2", list_id=list1)
        item2.save()

        items = list(list1.item_set.all())
        self.assertEqual(len(items), 2)
        # note the order: the last added items appear first
        self.assertEqual(items[0].content, "item2")
        self.assertEqual(items[1].content, "item1")

    def test_list_5(self):
        """Process some items of a list"""
        list1 = List(name="List1")
        list1.save()
        item1 = Item(content="item1", list_id=list1)
        item1.save()
        item2 = Item(content="item2", list_id=list1)
        item2.save()
        item3 = Item(content="item3", list_id=list1)
        item3.save()

        item1 = list1.item_set.filter(content="item1").first()
        item1.is_processed = True
        item2 = list1.item_set.filter(content="item2").first()
        item3 = list1.item_set.filter(content="item3").first()
        item3.is_processed = True

        self.assertTrue(item1.is_processed)
        self.assertFalse(item2.is_processed)
        self.assertTrue(item3.is_processed)

    def test_list_6(self):
        """Check the ordering of lists"""
        list1 = List(name="List1")
        list1.save()
        list2 = List(name="List2")
        list2.save()
        list3 = List(name="List3")
        list3.save()

        lists = List.objects.all()
        # note the order: the last added lists appear first
        self.assertEqual(lists[0].name, "List3")
        self.assertEqual(lists[1].name, "List2")
        self.assertEqual(lists[2].name, "List1")
