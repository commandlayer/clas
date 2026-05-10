#!/usr/bin/env python3
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
errors = []

for path in root.rglob("*.json"):
    try:
        json.loads(path.read_text())
    except Exception as exc:
        errors.append(f"{path.relative_to(root)}: {exc}")

if errors:
    print("JSON validation failed:")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print("All JSON files parse successfully.")
