#!/usr/bin/env python3
import http.server
import socketserver

PORT = 4534

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        super().do_GET()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running on port {PORT}: http://localhost:{PORT}/")
    httpd.serve_forever()