import json
test = {
    "Make": "TestMake",
    "Model": "TestModel",
    "Series": "TestSeries",
    "Price": 150.99,
    "Discount": 50,
    "Quantity": 5,
    "Volume": 90,
    "Reviews": "5/5",
    "Site": "example.com"
}

jsonTest = json.dumps(test)

print(jsonTest)