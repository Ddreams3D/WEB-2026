import sys
import os

# Ensure we can import modules from current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# EXPLICIT IMPORTS FOR PYINSTALLER (Flattened)
try:
    import ui.app
    import core.parser
    import services.api
    import utils.logger
    import domain.models
    import config
except ImportError:
    pass

from main import main

if __name__ == "__main__":
    main()
