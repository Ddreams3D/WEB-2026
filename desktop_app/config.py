# Configuration Environment
# 'development' = Conecta a tu PC (localhost:3000) - Requiere 'npm run dev'
# 'production'  = Conecta a la web real (ddreams3d.com) - Funciona siempre
ENV = 'production' 

# Production Config
PROD_DOMAIN = "ddreams3d.com"
PROD_URL = f"https://{PROD_DOMAIN}"

# Development Config
DEV_HOST = "127.0.0.1"
DEV_PORT = "3000"
DEV_URL = f"http://{DEV_HOST}:{DEV_PORT}"

# Active Config selection
if ENV == 'production':
    WEB_URL = PROD_URL
else:
    WEB_URL = DEV_URL

API_BASE = f"{WEB_URL}/api/production"
API_URL = f"{API_BASE}/slicer-hook"
API_PRODUCTS_URL = f"{API_BASE}/products-list"

# Machine Link
# Pega aquí el ID de la máquina de la web (ej: "123-abc-...")
# Si se deja vacío, la web intentará adivinar por el nombre del modelo.
MACHINE_ID = ""

SECRET_TOKEN = "tu_secreto_super_seguro" 
VERSION = "13.3-Cloud"
