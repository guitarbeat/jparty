from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from typing import Dict, Set
import asyncio


class BuzzHub:
    def __init__(self) -> None:
        self.active_connections: Set[WebSocket] = set()
        self.first_buzz_received: bool = False
        self.first_buzz_payload: Dict | None = None
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.discard(websocket)

    async def reset(self) -> None:
        async with self._lock:
            self.first_buzz_received = False
            self.first_buzz_payload = None
        await self.broadcast({"type": "reset"})

    async def broadcast(self, message: Dict) -> None:
        dead: Set[WebSocket] = set()
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except Exception:
                dead.add(conn)
        for d in dead:
            self.disconnect(d)

    async def handle_buzz(self, payload: Dict) -> Dict:
        async with self._lock:
            if not self.first_buzz_received:
                self.first_buzz_received = True
                self.first_buzz_payload = payload
                result = {"type": "buzz", "winner": payload}
            else:
                result = {"type": "ignored", "reason": "already_won"}
        await self.broadcast(result)
        return result


hub = BuzzHub()
app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.websocket("/ws/buzz")
async def websocket_buzz(websocket: WebSocket):
    await hub.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            kind = data.get("type")
            if kind == "buzz":
                player = data.get("player") or "anonymous"
                color = data.get("color") or "#ffcc00"
                await hub.handle_buzz({"player": player, "color": color})
            elif kind == "reset":
                await hub.reset()
            else:
                await websocket.send_json({"type": "error", "message": "unknown_type"})
    except WebSocketDisconnect:
        hub.disconnect(websocket)

