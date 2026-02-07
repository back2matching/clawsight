# Server Chrome Remote Access

How to control a real Chrome browser on the server from your local machine.

## Architecture

```
Your Chrome tab (localhost:8766)
    ↕ WebSocket (ws://localhost:8766/chrome)
Local Proxy (Node.js, port 8766)
    ↕ WebSocket (ws://localhost:9877/devtools/page/...)
SSH Tunnel (local:9877 → server:9333)
    ↕ Chrome DevTools Protocol
Real Chrome (server, port 9333, DISPLAY=:99)
    ↕
Xvfb virtual display (:99, 1920x1080)
```

## Why Each Piece Exists

- **Xvfb**: Server has no monitor. Xvfb fakes a display so Chrome runs as a real (non-headless) browser. Twitter and other sites block headless Chrome.
- **Real Chrome** (not headless shell): The full Chrome binary at `/tmp/chrome-extracted/opt/google/chrome/chrome`. Uses `--remote-debugging-port=9333` for CDP access.
- **SSH Tunnel**: Chrome debug port is bound to 127.0.0.1 on the server. Tunnel makes it accessible locally.
- **WebSocket Proxy**: Chrome security blocks web pages from connecting to `ws://*/devtools/*` paths. The proxy relays through `/chrome` path instead. Also buffers messages until the server connection is ready (race condition fix).
- **Viewer HTML**: Simple page that uses CDP `Page.startScreencast` to stream the server Chrome's screen and forwards mouse/keyboard input.

## Quick Start

### 1. Start Xvfb + Chrome on Server

```bash
ssh -i /c/Users/PC/.ssh/id_ed25519 conforming@66.118.236.142 'bash /tmp/start-real-chrome.sh'
```

The script (`/tmp/start-real-chrome.sh`) does:
- Kills existing Xvfb/Chrome
- Starts patched Xvfb on display :99
- Starts real Chrome with remote debugging on port 9333
- Chrome profile: `~/.chrome-twitter`

### 2. SSH Tunnel

```bash
ssh -i /c/Users/PC/.ssh/id_ed25519 -L 9877:127.0.0.1:9333 -N conforming@66.118.236.142
```

Verify: `curl http://127.0.0.1:9877/json/version`

### 3. Start Local Proxy

```bash
cd skills/dev-browser  # or wherever the proxy script is
node proxy-server.js
```

Or inline:
```js
const http = require('http');
const fs = require('fs');
const { WebSocket, WebSocketServer } = require('ws');

const httpServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(fs.readFileSync('tmp/viewer.html'));
});

const wss = new WebSocketServer({ server: httpServer, path: '/chrome' });
wss.on('connection', (clientWs) => {
  const pendingMessages = [];
  let remoteReady = false;

  // Get page ID from http://localhost:9877/json first
  const remoteWs = new WebSocket('ws://127.0.0.1:9877/devtools/page/<PAGE_ID>');

  remoteWs.on('open', () => {
    remoteReady = true;
    pendingMessages.forEach(msg => remoteWs.send(msg));
    pendingMessages.length = 0;
  });

  remoteWs.on('message', (data) => {
    if (clientWs.readyState === 1) clientWs.send(data.toString()); // MUST be .toString()
  });
  remoteWs.on('close', () => clientWs.close());

  clientWs.on('message', (data) => {
    const msg = data.toString();
    if (remoteReady && remoteWs.readyState === 1) {
      remoteWs.send(msg);
    } else {
      pendingMessages.push(msg); // Buffer until server ready
    }
  });
  clientWs.on('close', () => remoteWs.close());
});

httpServer.listen(8766, () => console.log('Ready on http://localhost:8766'));
```

### 4. Open Viewer

Navigate to `http://localhost:8766` in your Chrome. You'll see the server's Chrome screen and can click/type to interact.

## Server Setup Details

### Installed Without Sudo

All dependencies extracted from .deb packages (no root required):

| Component | Location |
|-----------|----------|
| Chrome | `/tmp/chrome-extracted/opt/google/chrome/chrome` |
| Chrome libs | `/tmp/chrome-libs/lib/` |
| Xvfb (patched) | `~/xvfb-local/usr/bin/Xvfb.patched` |
| Xvfb libs | `~/xvfb-local/usr/lib/x86_64-linux-gnu/` |
| XKB data | `~/xvfb-local/usr/share/X11/xkb/` |
| xkbcomp wrapper | `/tmp/xkbcomp` (wrapper) + `/tmp/xkbcomp.real` (binary) |
| Chrome profile | `~/.chrome-twitter/` |

### Xvfb Binary Patch

The Xvfb binary hardcodes `/usr/bin` as the xkbcomp search path. Since we can't write to `/usr/bin`, we binary-patched the Xvfb binary to look in `/tmp` instead:

```python
# Offset 1704712: b'/usr/bin' → b'/tmp\x00\x00\x00\x00'
data[1704712:1704720] = b'/tmp\x00\x00\x00\x00'
```

The xkbcomp at `/tmp/xkbcomp` is a wrapper script that sets LD_LIBRARY_PATH before calling the real binary.

### Startup Script

`/tmp/start-real-chrome.sh`:
```bash
#!/bin/bash
pkill -f "Xvfb" 2>/dev/null
pkill -f "chrome.*9333" 2>/dev/null
sleep 1

export XKB_CONFIG_ROOT=$HOME/xvfb-local/usr/share/X11/xkb
export LD_LIBRARY_PATH=$HOME/xvfb-local/usr/lib/x86_64-linux-gnu
nohup $HOME/xvfb-local/usr/bin/Xvfb.patched :99 -screen 0 1920x1080x24 -ac -nolisten tcp > /tmp/xvfb.log 2>&1 &
sleep 2

export DISPLAY=:99
export LD_LIBRARY_PATH=/tmp/chrome-libs/lib:$HOME/xvfb-local/usr/lib/x86_64-linux-gnu
/tmp/chrome-extracted/opt/google/chrome/chrome \
    --remote-debugging-port=9333 \
    --remote-debugging-address=127.0.0.1 \
    --no-sandbox \
    --no-first-run \
    --no-default-browser-check \
    --user-data-dir=$HOME/.chrome-twitter \
    --window-size=1920,1080 \
    about:blank &
sleep 4
curl -s http://127.0.0.1:9333/json/version
```

## Using Chrome from the Server Agent

Once logged into Twitter via the viewer, the session persists in the Chrome profile at `~/.chrome-twitter/`. The server agent can use this Chrome instance directly via CDP without needing the SSH tunnel or local proxy.

### Connecting from Server Scripts

```bash
# Check Chrome is running and get page targets
curl -s http://127.0.0.1:9333/json

# Get current page ID
curl -s http://127.0.0.1:9333/json | python3 -c "import sys,json; pages=[p for p in json.load(sys.stdin) if p['type']=='page' and p['url']!='about:blank']; print(pages[0]['id'] if pages else 'none')"
```

### CDP via Node.js on Server

```js
const WebSocket = require('ws');

// Get page list first
const pages = await fetch('http://127.0.0.1:9333/json').then(r => r.json());
const page = pages.find(p => p.type === 'page' && p.url.includes('x.com'));

// Connect via CDP
const ws = new WebSocket(page.webSocketDebuggerUrl);
ws.on('open', () => {
  // Navigate, extract cookies, interact, etc.
  ws.send(JSON.stringify({id: 1, method: 'Network.getAllCookies'}));
});
ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  console.log(msg);
});
```

### Extracting Twitter Cookies

For agents that need Twitter auth tokens without using CDP directly:

```bash
# From server - extract cookies via CDP
node -e "
const ws = require('ws');
const http = require('http');
http.get('http://127.0.0.1:9333/json', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const pages = JSON.parse(d);
    const page = pages.find(p => p.type === 'page' && p.url.includes('x.com'));
    if (!page) { console.log('No Twitter page found'); return; }
    const w = new ws(page.webSocketDebuggerUrl);
    w.on('open', () => w.send(JSON.stringify({id:1, method:'Network.getAllCookies'})));
    w.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 1) {
        const twitter = msg.result.cookies.filter(c => c.domain.includes('.x.com') || c.domain.includes('.twitter.com'));
        console.log(JSON.stringify(twitter, null, 2));
        w.close();
      }
    });
  });
});
"
```

Key cookies for Twitter API access: `auth_token`, `ct0` (CSRF token).

### Important for Server Agent

- **Chrome profile**: `~/.chrome-twitter/` - cookies persist across Chrome restarts
- **CDP port**: `127.0.0.1:9333` (localhost only, no external access)
- **One CDP client per page**: Only one WebSocket connection per page target at a time
- **Restart Chrome**: Run `bash /tmp/start-real-chrome.sh` if Chrome crashes
- **Check if running**: `pgrep -f "chrome.*9333"` or `curl -s http://127.0.0.1:9333/json/version`
- **Don't use headless**: The whole point is that this is real Chrome with Xvfb. Twitter blocks headless browsers.

## Gotchas

1. **Get page ID first**: Before connecting, get the target page ID from `curl http://127.0.0.1:9333/json` (on server) or `curl http://localhost:9877/json` (local via tunnel). The ID changes when Chrome restarts.
2. **One CDP client at a time**: Only one WebSocket can connect to a page target. Close other connections first.
3. **Buffer proxy messages**: The browser sends CDP commands immediately on WebSocket open, but the proxy needs time to connect to the server. Always buffer.
4. **Send text not binary**: The `ws` library returns Buffers. Always `.toString()` before forwarding to the browser, or `JSON.parse()` will fail silently.
5. **Chrome blocks /devtools/ paths**: Web pages cannot connect to `ws://*/devtools/*` for security. Must proxy through a different path.
6. **Cookies persist in profile**: Login sessions are saved in `~/.chrome-twitter/`. No need to re-login after Chrome restart (unless cookies expire).
7. **Google sign-in popups**: "Sign in with Google" opens a new page target. The viewer has a page switcher dropdown to handle this. Use username/password flow when possible - more reliable on servers.
8. **Page IDs change**: Every Chrome restart assigns new page IDs. Always query `/json` for current IDs, never hardcode them.

## Local Viewer (Remote Control)

### Proxy with Page Switcher

The improved proxy auto-detects pages and supports switching between them. Located at `skills/dev-browser/tmp/proxy.cjs`:

```bash
# Start proxy (requires SSH tunnel on port 9877 first)
cd skills/dev-browser && node tmp/proxy.cjs
```

Features:
- Page switcher dropdown to control different tabs
- Auto-detects active pages from server Chrome
- `/pages` API endpoint returns JSON list of open pages
- Viewer at `http://localhost:8766` with mouse, keyboard, scroll, paste support

## Dev-Browser Extension

The extension is at `C:\Users\PC\Documents\dev-browser-extension\dev-browser-extension-1.0.0-chrome\`.

It was patched to use port 9555 (default is 9222, which conflicts with the standalone dev-browser server). If you need to change the port, edit `background.js` and replace all `localhost:9555` references.

The relay server runs on port 9555. It's started by the dev-browser skill: `cd skills/dev-browser && npm run start-extension`
