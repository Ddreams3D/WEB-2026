import socket
import threading
import sys
from utils.logger import Logger

class SingleInstanceManager:
    def __init__(self, port=65500, logger=None):
        self.port = port
        self.logger = logger or Logger()
        self.server_socket = None
        self.running = False

    def is_main_instance(self):
        """
        Tries to bind to the port. 
        If successful, returns True (we are the main instance).
        If failed, returns False (another instance is running).
        """
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.bind(('127.0.0.1', self.port))
            self.server_socket.listen(5)
            return True
        except socket.error:
            return False

    def start_server(self, callback):
        """
        Starts a thread to listen for incoming messages (file paths).
        callback(message): function to call when message received.
        """
        self.running = True
        thread = threading.Thread(target=self._server_loop, args=(callback,), daemon=True)
        thread.start()

    def _server_loop(self, callback):
        self.logger.info(f"IPC Server listening on port {self.port}")
        while self.running:
            try:
                client, addr = self.server_socket.accept()
                data = client.recv(4096).decode('utf-8')
                if data:
                    self.logger.info(f"IPC Received: {data}")
                    # Run callback in main thread if possible, but here we just call it.
                    # UI updates must be scheduled via root.after in the callback implementation.
                    callback(data)
                client.close()
            except Exception as e:
                if self.running:
                    self.logger.error(f"IPC Server error: {e}")

    def send_to_main(self, message):
        """Sends a message to the main instance."""
        try:
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client.connect(('127.0.0.1', self.port))
            client.sendall(message.encode('utf-8'))
            client.close()
            return True
        except Exception as e:
            self.logger.error(f"IPC Client error: {e}")
            return False

    def stop(self):
        self.running = False
        if self.server_socket:
            try:
                self.server_socket.close()
            except: pass
