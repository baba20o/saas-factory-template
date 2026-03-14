#!/usr/bin/env python3
"""
AI Image Generator — CLI tool for generating images via OpenAI gpt-image-1

Usage:
    python scripts/imagegen.py "A futuristic dashboard with glowing charts"
    python scripts/imagegen.py "Abstract gradient hero image" --size 1536x1024 --output hero.png
    python scripts/imagegen.py "Logo for PlanForge" --size 1024x1024 --quality high --format webp

Models: gpt-image-1 (default), gpt-image-1-mini, dall-e-3
Sizes:  auto, 1024x1024, 1536x1024 (landscape), 1024x1536 (portrait)
Quality: auto, low, medium, high
Format: png (default), jpeg, webp
"""

import argparse
import base64
import json
import os
import sys
import urllib.request
from pathlib import Path


def get_api_key() -> str:
    """Find OpenAI API key from env or .env file."""
    key = os.environ.get("OPENAI_API_KEY") or os.environ.get("CODEX_API_KEY")
    if key:
        return key

    # Try loading from .env
    for env_path in [
        Path(__file__).resolve().parent.parent / ".env.local",
        Path.home() / "projects" / "co-deworker" / ".env",
    ]:
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                if line.startswith("CODEX_API_KEY="):
                    return line.split("=", 1)[1].strip()
                if line.startswith("OPENAI_API_KEY="):
                    return line.split("=", 1)[1].strip()

    print("ERROR: No OpenAI API key found. Set OPENAI_API_KEY or CODEX_API_KEY.")
    sys.exit(1)


def generate_image(
    prompt: str,
    model: str = "gpt-image-1",
    size: str = "1024x1024",
    quality: str = "auto",
    output_format: str = "png",
    n: int = 1,
) -> list[bytes]:
    """Call OpenAI image generation API and return image bytes."""
    api_key = get_api_key()

    payload = {
        "model": model,
        "prompt": prompt,
        "n": n,
        "size": size,
        "quality": quality,
    }

    # gpt-image-1 always returns b64, dall-e-3 can do url
    if model.startswith("gpt-image-1"):
        payload["output_format"] = output_format
    else:
        payload["response_format"] = "b64_json"

    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )

    print(f"Generating: \"{prompt}\"")
    print(f"Model: {model} | Size: {size} | Quality: {quality} | Format: {output_format}")
    print("...")

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"ERROR {e.code}: {body}")
        sys.exit(1)

    images = []
    for item in result.get("data", []):
        if "b64_json" in item:
            images.append(base64.b64decode(item["b64_json"]))
        elif "url" in item:
            with urllib.request.urlopen(item["url"]) as img_resp:
                images.append(img_resp.read())

    # Print usage if available
    usage = result.get("usage", {})
    if usage:
        print(f"Tokens: {usage.get('total_tokens', '?')} (input: {usage.get('input_tokens', '?')}, output: {usage.get('output_tokens', '?')})")

    return images


def main():
    parser = argparse.ArgumentParser(
        description="Generate images with OpenAI gpt-image-1",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("prompt", help="Text description of the desired image")
    parser.add_argument(
        "-o", "--output",
        help="Output filename (default: auto-generated from prompt)",
    )
    parser.add_argument(
        "-d", "--dir",
        default=".",
        help="Output directory (default: current dir)",
    )
    parser.add_argument(
        "--model",
        default="gpt-image-1",
        choices=["gpt-image-1", "gpt-image-1-mini", "dall-e-3", "dall-e-2"],
        help="Model to use (default: gpt-image-1)",
    )
    parser.add_argument(
        "--size",
        default="1024x1024",
        choices=["auto", "1024x1024", "1536x1024", "1024x1536", "1792x1024", "1024x1792"],
        help="Image size (default: 1024x1024)",
    )
    parser.add_argument(
        "--quality",
        default="auto",
        choices=["auto", "low", "medium", "high", "hd", "standard"],
        help="Image quality (default: auto)",
    )
    parser.add_argument(
        "--format",
        default="png",
        choices=["png", "jpeg", "webp"],
        dest="output_format",
        help="Output format (default: png)",
    )
    parser.add_argument(
        "-n", "--count",
        type=int,
        default=1,
        help="Number of images to generate (default: 1)",
    )

    args = parser.parse_args()

    images = generate_image(
        prompt=args.prompt,
        model=args.model,
        size=args.size,
        quality=args.quality,
        output_format=args.output_format,
        n=args.count,
    )

    out_dir = Path(args.dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    for i, img_bytes in enumerate(images):
        if args.output:
            if len(images) > 1:
                stem = Path(args.output).stem
                ext = Path(args.output).suffix or f".{args.output_format}"
                filename = f"{stem}_{i+1}{ext}"
            else:
                filename = args.output
        else:
            # Auto-generate from prompt
            slug = args.prompt[:50].lower()
            slug = "".join(c if c.isalnum() or c == " " else "" for c in slug)
            slug = slug.strip().replace(" ", "_")
            suffix = f"_{i+1}" if len(images) > 1 else ""
            filename = f"{slug}{suffix}.{args.output_format}"

        out_path = out_dir / filename
        out_path.write_bytes(img_bytes)
        print(f"Saved: {out_path} ({len(img_bytes) / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
