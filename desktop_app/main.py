import sys
import os

# Ensure 'scripts' folder is in sys.path so imports like 'from ui.app' work
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import time
import shutil
import subprocess
import tkinter as tk
import customtkinter as ctk
from utils.logger import Logger
from core.parser import GCodeParser
from services.api import ProductionService
from ui.app import MainWindow
from core.ipc import SingleInstanceManager

def main():
    logger = Logger()
    
    # Configure CustomTkinter
    ctk.set_appearance_mode("Dark")
    ctk.set_default_color_theme("blue")

    # 1. Argument Handling
    if len(sys.argv) < 2:
        file_path = "test_gcode.gcode"
    else:
        file_path = sys.argv[1]

    # 2. Detached Mode Launcher
    if "--worker" not in sys.argv:
        try:
            logger.debug("Launcher started. Spawning worker...")
            temp_dir = os.path.join(os.environ.get('TEMP', os.getcwd()), 'ddreams_temp')
            os.makedirs(temp_dir, exist_ok=True)
            temp_file = os.path.join(temp_dir, f"temp_{int(time.time())}_{os.path.basename(file_path)}")
            
            # Robust copy loop
            max_retries = 5
            for i in range(max_retries):
                try:
                    # Check if source exists and has size
                    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
                        shutil.copy2(file_path, temp_file)
                        break
                    else:
                        logger.debug(f"Source file empty or missing, waiting... ({i+1}/{max_retries})")
                        time.sleep(1)
                except Exception as e:
                    logger.debug(f"Copy failed, retrying... ({i+1}/{max_retries}): {e}")
                    time.sleep(1)
            
            if not os.path.exists(temp_file):
                 logger.error("Failed to copy input file to temp location.")
                 # Fallback: try to pass original path if copy failed
                 temp_file = file_path

            if getattr(sys, 'frozen', False):
                exe_path = sys.executable
                cmd = [exe_path, temp_file, "--worker"]
            else:
                # Running from source - use absolute path to self
                cmd = [sys.executable, os.path.abspath(__file__), temp_file, "--worker"]
                
            subprocess.Popen(cmd, creationflags=0x00000008, close_fds=True)
            sys.exit(0)
        except Exception as e:
            logger.error(f"Launcher failed: {e}")

    # 3. Worker Logic
    if "--worker" in sys.argv:
        sys.argv.remove("--worker")
        file_path = sys.argv[1]

    # --- SINGLE INSTANCE CHECK ---
    # Try to become the main instance
    ipc = SingleInstanceManager(logger=logger)
    if not ipc.is_main_instance():
        logger.info("Another instance is running. Sending file and exiting.")
        if ipc.send_to_main(file_path):
            sys.exit(0)
        else:
            logger.error("Failed to communicate with main instance.")
            # Fallback: Run standalone if IPC fails? 
            # Better to exit or the user gets confused with multiple windows that don't sync.
            # But if IPC fails, maybe the port is stuck. Let's run standalone as fallback.
            pass 

    # 4. Dependency Injection
    parser = GCodeParser(logger)
    service = ProductionService(logger)

    # 5. Launch UI
    root = ctk.CTk()
    app = MainWindow(root, file_path, parser, service)
    
    # Start IPC Server to listen for more files
    def on_new_file(new_path):
        # Schedule UI update on main thread
        root.after(0, lambda: app.add_plate(new_path))

    ipc.start_server(on_new_file)
    
    def on_close():
        ipc.stop()
        root.destroy()
        try:
            # Only delete if it's a temp file we created
            if "ddreams_temp" in file_path:
                # Note: With multiple files, we might need to track all temp files to delete.
                # For now, we only delete the initial one or rely on OS temp cleanup.
                # The app.plates list will have other paths too.
                # We can iterate app.plates and delete if they are temp.
                for plate in app.plates:
                     if "ddreams_temp" in plate['path']:
                         try: os.remove(plate['path'])
                         except: pass
        except: pass
    
    root.protocol("WM_DELETE_WINDOW", on_close)
    root.mainloop()

if __name__ == "__main__":
    main()
