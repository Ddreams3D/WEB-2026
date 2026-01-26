import urllib.request
import json
import sys

API_URL = "http://localhost:3000/api/production/slicer-hook"
SECRET_TOKEN = "tu_secreto_super_seguro"

payload = {
    "secret_token": SECRET_TOKEN,
    "name": "Test Connection",
    "fileName": "test.gcode",
    "grams": 10.5,
    "time": 60,
    "machineType": "FDM",
    "scriptVersion": "TEST-1.0"
}

try:
    req = urllib.request.Request(API_URL)
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondata = json.dumps(payload).encode('utf-8')
    req.add_header('Content-Length', len(jsondata))
    
    print(f"Sending request to {API_URL}...")
    with urllib.request.urlopen(req, data=jsondata, timeout=10) as response:
        print(f"Response Code: {response.getcode()}")
        print(f"Response Body: {response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}")
    try:
        print(f"Body: {e.read().decode()}")
    except:
        pass
except urllib.error.URLError as e:
    print(f"Connection Error: {e.reason}")
except Exception as e:
    print(f"Error: {e}")
