import functools
from http.server import HTTPServer, SimpleHTTPRequestHandler

DIRECTORY = "/Users/Jeff/Documents/DEV/baron-smite"
Handler = functools.partial(SimpleHTTPRequestHandler, directory=DIRECTORY)
HTTPServer(("127.0.0.1", 4599), Handler).serve_forever()
