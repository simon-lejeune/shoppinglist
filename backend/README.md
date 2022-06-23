# ShoppingList

## Start

Use [direnv](https://direnv.net) to create and load the virtual environment automatically
```
brew install direnv
cd backend
direnv allow .
```

Install the dependencies in the virtual environment
```
pip install -r requirements-dev.txt
pip install -r requirements.txt
```

Setup the database
```
./manage.py migrate
```

Create a superuser
```
./manage.py createsuperuser
```

Run the server
```
./manage.py runserver
```

## Dependencies

We use [pip-tools](https://pypi.org/project/pip-tools/).
