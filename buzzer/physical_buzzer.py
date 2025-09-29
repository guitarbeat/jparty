import argparse
import asyncio
import json
import os
import sys

import pygame
import websockets


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Physical buzzer client (pygame + joystick)")
    parser.add_argument("--server", default="ws://localhost:8000/ws/buzz", help="WebSocket server URL")
    parser.add_argument("--player", default="Player1", help="Player name")
    parser.add_argument("--color", default="#ff0000", help="Player color (hex)")
    parser.add_argument("--button-index", type=int, default=0, help="Joystick button index to buzz")
    return parser.parse_args()


async def run_client(server_url: str, player: str, color: str, button_index: int) -> None:
    print(f"Connecting to {server_url} as {player} ({color}) ...")
    async with websockets.connect(server_url) as ws:
        # Initialize pygame for joystick
        pygame.init()
        pygame.joystick.init()
        if pygame.joystick.get_count() == 0:
            print("No joystick detected. Plug in a controller and try again.")
            return
        joystick = pygame.joystick.Joystick(0)
        joystick.init()
        print(f"Using joystick: {joystick.get_name()}")

        try:
            while True:
                for event in pygame.event.get():
                    if event.type == pygame.JOYBUTTONDOWN and event.button == button_index:
                        payload = {"type": "buzz", "player": player, "color": color}
                        await ws.send(json.dumps(payload))
                        print("Buzz sent")
                await asyncio.sleep(0.01)
        finally:
            pygame.quit()


def main() -> None:
    args = parse_args()
    try:
        asyncio.run(run_client(args.server, args.player, args.color, args.button_index))
    except KeyboardInterrupt:
        print("Exiting...")


if __name__ == "__main__":
    main()

