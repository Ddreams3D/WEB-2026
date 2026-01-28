import json
import os
from typing import Dict

class PatternManager:
    def __init__(self):
        self.config_dir = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'ddreams_config')
        self.config_file = os.path.join(self.config_dir, 'user_patterns.json')
        os.makedirs(self.config_dir, exist_ok=True)
        
        self.default_patterns = {
            'time': r";\s*(?:estimated printing time \(normal mode\)|total estimated time|model printing time)\s*[:=]\s*(.*)",
            'filament_grams': r";\s*(?:filament used \[g\]|total filament weight \[g\])\s*[:=]\s*(.*)",
            'filament_meters': r";\s*(?:filament used \[mm\]|total filament length \[mm\])\s*[:=]\s*(.*)",
            'filament_type': r";\s*filament_type\s*[:=]\s*(.*)",
            'total_layers': r";\s*total layers count\s*[:=]\s*(\d+)",
            'printer_model': r";\s*printer_model\s*[:=]\s*(.*)",
        }
        
        self.patterns = self._load_patterns()

    def _load_patterns(self) -> Dict[str, str]:
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r') as f:
                    saved = json.load(f)
                    # Merge defaults with saved (saved overrides defaults)
                    return {**self.default_patterns, **saved}
            except:
                return self.default_patterns.copy()
        return self.default_patterns.copy()

    def save_pattern(self, key: str, regex: str):
        # Update in-memory
        self.patterns[key] = regex
        
        # Load existing file first to preserve other keys if they exist
        existing = {}
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r') as f:
                    existing = json.load(f)
            except:
                pass
        
        # Update with new pattern
        existing[key] = regex
        
        # Save merged dictionary
        try:
            with open(self.config_file, 'w') as f:
                json.dump(existing, f, indent=2)
        except Exception as e:
            print(f"Error saving pattern: {e}")

    def reset_defaults(self):
        self.patterns = self.default_patterns.copy()
        if os.path.exists(self.config_file):
            os.remove(self.config_file)
