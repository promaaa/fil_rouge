#!/usr/bin/env python3
import json
import sys
import shutil
from pathlib import Path


def prune(obj):
    """Recursively remove empty values:
    - For dict: remove keys whose pruned value is None
    - For list: keep pruned items; if result empty -> return None
    - For strings: if empty or whitespace -> return None
    - For None -> return None
    - Otherwise return object (with pruned children)
    """
    if obj is None:
        return None
    if isinstance(obj, str):
        s = obj.strip()
        return s if s != "" else None
    if isinstance(obj, dict):
        new = {}
        for k, v in obj.items():
            pv = prune(v)
            if pv is not None:
                new[k] = pv
        return new if new else None
    if isinstance(obj, list):
        new_list = []
        for item in obj:
            pv = prune(item)
            if pv is not None:
                new_list.append(pv)
        return new_list if new_list else None
    # numbers, booleans, etc. keep as-is
    return obj


def main(path):
    p = Path(path)
    if not p.exists():
        print(f"File not found: {path}")
        return 2
    # backup
    bak = p.with_suffix(p.suffix + '.bak')
    shutil.copy2(p, bak)
    print(f"Backup saved to: {bak}")

    data = json.loads(p.read_text(encoding='utf-8'))
    pruned = prune(data)
    if pruned is None:
        print("Resulting JSON is empty after pruning. Aborting write.")
        return 3

    # Pretty write back
    p.write_text(json.dumps(pruned, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"Pruned JSON written to: {p}")
    return 0


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: clean_empty_keys.py <path-to-json>")
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
