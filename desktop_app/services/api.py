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

    def send_data(self, stats: GCodeStats, filename: str, product_id: Optional[str], name: str, version: str) -> bool:
        payload = stats.to_dict()
        payload.update({
            "secret_token": SECRET_TOKEN,
            "name": name,
            "fileName": filename,
            "scriptVersion": version,
            # Additional metadata could be added here
        })
        
        if product_id:
            payload['linkedProductId'] = product_id

        try:
            req = urllib.request.Request(API_URL)
            req.add_header('Content-Type', 'application/json; charset=utf-8')
            jsondata = json.dumps(payload).encode('utf-8')
            req.add_header('Content-Length', len(jsondata))
            
            with urllib.request.urlopen(req, data=jsondata, timeout=10) as response:
                return response.getcode() == 200
        except Exception as e:
            self.logger.error(f"Error sending data: {e}")
            return False
