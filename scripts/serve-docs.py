#!/usr/bin/env python3
"""Threaded static server for Playwright (docs/). Ignores client disconnects."""
from __future__ import print_function
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')
PORT = int(os.environ.get('SOULCAP_PORT', '8788'))


class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        kwargs['directory'] = ROOT
        SimpleHTTPRequestHandler.__init__(self, *args, **kwargs)

    def copyfile(self, source, outputfile):
        try:
            SimpleHTTPRequestHandler.copyfile(self, source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, fmt, *args):
        # Keep CI logs quiet; uncomment for local debug.
        pass


def main():
    if not os.path.isdir(ROOT):
        sys.stderr.write('docs/ missing at %s\n' % ROOT)
        sys.exit(1)
    httpd = ThreadingHTTPServer(('127.0.0.1', PORT), QuietHandler)
    sys.stderr.write('SoulCap static http://127.0.0.1:%s/ -> %s\n' % (PORT, ROOT))
    sys.stderr.flush()
    httpd.serve_forever()


if __name__ == '__main__':
    main()
