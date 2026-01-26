import json
import urllib.request
import urllib.error
from typing import List, Optional
from domain.models import Product, GCodeStats
from utils.logger import Logger
from config import API_URL, API_PRODUCTS_URL, SECRET_TOKEN

class ProductionService:
    def __init__(self, logger: Logger):
        self.logger = logger

    def get_products(self) -> List[Product]:
        try:
            url = f"{API_PRODUCTS_URL}?secret_token={SECRET_TOKEN}"
            with urllib.request.urlopen(url, timeout=5) as res:
                if res.getcode() == 200:
                    data = json.loads(res.read())
                    return [Product(id=p['id'], name=p['name'], image_url=p.get('imageUrl')) for p in data]
        except Exception as e:
            self.logger.error(f"Error fetching products: {e}")
            return []
        return []

    def send_data(self, stats: GCodeStats, filename: str, product_id: Optional[str], name: str, version: str, target: str = 'product') -> str:
        payload = stats.to_dict()
        payload.update({
            "secret_token": SECRET_TOKEN,
            "name": name,
            "fileName": filename,
            "scriptVersion": version,
            "target": target
        })
        
        if product_id:
            payload['linkedProductId'] = product_id

        try:
            req = urllib.request.Request(API_URL)
            req.add_header('Content-Type', 'application/json; charset=utf-8')
            jsondata = json.dumps(payload).encode('utf-8')
            req.add_header('Content-Length', len(jsondata))
            
            with urllib.request.urlopen(req, data=jsondata, timeout=10) as response:
                if response.getcode() == 200:
                    resp_body = json.loads(response.read())
                    return resp_body.get('id', '')
                else:
                    raise Exception(f"HTTP {response.getcode()}")
        except urllib.error.HTTPError as e:
            error_msg = f"HTTP {e.code}"
            try:
                body = e.read().decode('utf-8')
                error_msg += f": {body}"
            except:
                pass
            self.logger.error(f"API Error: {error_msg}")
            raise Exception(error_msg)
        except urllib.error.URLError as e:
            self.logger.error(f"Connection Error: {e.reason}")
            raise Exception(f"Connection Error: {e.reason}")
        except Exception as e:
            self.logger.error(f"Error sending data: {e}")
            raise Exception(f"Error: {e}")
