
# JParty Buzzer Integration (WIP)

This PR scaffolds a minimal buzzer system inspired by `@gdsimco/JParty-with-buzzers`:

- FastAPI WebSocket server to accept buzz events
- Simple web client (vanilla JS) for browser/mobile buzzing
- Physical buzzer client using `pygame` joystick input
- Shared message protocol and configuration

## Quick start

1) Install dependencies:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

2) Run the server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

3) Open the web client:

`http://localhost:8000`

4) Optional: Run the physical buzzer client (needs a joystick/controller):

```bash
python buzzer/physical_buzzer.py --server ws://localhost:8000/ws/buzz --player Player1 --color red
```

## Repo structure

```
app/
  main.py               # FastAPI app and WebSocket endpoint
  templates/index.html  # Web client UI
  static/app.js         # Web client script
buzzer/
  physical_buzzer.py    # pygame-based joystick buzzer client
config/
  settings.example.toml # Example configuration
requirements.txt
```

## Notes

- This is an initial WIP scaffold to enable end-to-end tests. Further integration with the full JParty app will follow.To run locally:
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

Open http://localhost:8000

Optional: python buzzer/physical_buzzer.py --server ws://localhost:8000/ws/buzz --player Player1 --color red
