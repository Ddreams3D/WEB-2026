from dataclasses import dataclass, field
from typing import Optional, List

@dataclass
class Product:
    id: str
    name: str
    image_url: Optional[str] = None

@dataclass
class GCodeStats:
    grams: float = 0.0
    time_minutes: int = 0
    filament_type: str = "Unknown"
    machine_type: str = "FDM"
    quality_profile: str = "Standard"
    printer_model: str = "Unknown"
    nozzle_diameter: str = "Unknown"
    total_layers: int = 0
    filament_length_m: float = 0.0
    multicolor_changes: int = 0
    thumbnail_b64: Optional[str] = None
    
    def to_dict(self):
        return {
            "grams": self.grams,
            "time": self.time_minutes,
            "machineType": self.machine_type,
            "filamentType": self.filament_type,
            "qualityProfile": self.quality_profile,
            "printerModel": self.printer_model,
            "nozzleDiameter": self.nozzle_diameter,
            "totalLayers": self.total_layers,
            "filamentLengthMeters": self.filament_length_m,
            "multicolorChanges": self.multicolor_changes,
        }
