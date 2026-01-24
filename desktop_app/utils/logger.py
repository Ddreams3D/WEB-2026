import os
from datetime import datetime

class Logger:
    def __init__(self):
        self.log_dir = os.path.expanduser("~")
        self.debug_file = os.path.join(self.log_dir, "ddreams_debug.txt")
        self.error_file = os.path.join(self.log_dir, "ddreams_error.log")

    def debug(self, msg: str):
        self._write(self.debug_file, f"[DEBUG] {msg}")

    def info(self, msg: str):
        self._write(self.debug_file, f"[INFO] {msg}")

    def error(self, msg: str):
        print(f"ERROR: {msg}")
        self._write(self.debug_file, f"[ERROR] {msg}")
        self._write(self.error_file, f"[ERROR] {msg}")

    def _write(self, path: str, msg: str):
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with open(path, "a", encoding="utf-8") as f:
                f.write(f"[{timestamp}] {msg}\n")
        except: pass
