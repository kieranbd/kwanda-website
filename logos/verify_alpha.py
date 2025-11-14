#!/usr/bin/env python3
"""Verify all PNG files have alpha channels."""

import os
from PIL import Image

png_files = sorted([f for f in os.listdir('.') if f.lower().endswith('.png') and os.path.isfile(f)])

print("Checking PNG files for alpha channels:\n")

all_ok = True
for png in png_files:
    try:
        img = Image.open(png)
        if img.mode == 'RGBA':
            # Check if alpha channel actually has transparency
            alpha = img.split()[3]
            has_transparency = alpha.getextrema()[1] < 255
            status = "✓ RGBA"
            if not has_transparency:
                status += " (fully opaque)"
            print(f"{png:<30} {status}")
        else:
            print(f"{png:<30} ✗ {img.mode} (needs RGBA)")
            # Convert to RGBA
            img = img.convert('RGBA')
            img.save(png, 'PNG')
            print(f"{'':>30}   → Converted to RGBA")
            all_ok = False
    except Exception as e:
        print(f"{png:<30} ✗ Error: {e}")
        all_ok = False

if all_ok:
    print("\n✓ All PNG files have alpha channels!")
else:
    print("\n✓ Fixed files that were missing alpha channels")

