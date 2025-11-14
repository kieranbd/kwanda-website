#!/usr/bin/env python3
"""
Convert all non-PNG logos to PNG format with alpha channel.
Preserve originals in 'old' subdirectory.
"""

import os
from PIL import Image
import shutil

def ensure_alpha_channel(img):
    """Ensure image has an alpha channel, adding one if needed."""
    if img.mode == 'RGBA':
        return img
    elif img.mode == 'RGB':
        # Add alpha channel (fully opaque)
        return img.convert('RGBA')
    elif img.mode == 'P':
        # Palette mode - convert to RGBA
        return img.convert('RGBA')
    elif img.mode == 'LA':
        # Grayscale with alpha
        return img.convert('RGBA')
    elif img.mode == 'L':
        # Grayscale - add alpha
        return img.convert('RGBA')
    else:
        # Convert to RGBA
        return img.convert('RGBA')

def convert_file_to_png(filename):
    """Convert a single file to PNG with alpha channel."""
    name, ext = os.path.splitext(filename)
    ext_lower = ext.lower()
    
    # Skip if already PNG
    if ext_lower == '.png':
        # Check if it has alpha channel
        try:
            img = Image.open(filename)
            if img.mode != 'RGBA':
                print(f"  Converting {filename} to RGBA (currently {img.mode})")
                img = ensure_alpha_channel(img)
                img.save(filename, 'PNG')
                print(f"  ✓ Added alpha channel to {filename}")
            else:
                print(f"  ✓ {filename} already has alpha channel")
            return True
        except Exception as e:
            print(f"  ✗ Error checking {filename}: {e}")
            return False
    
    # Convert SVG/WEBP/other formats
    if ext_lower in ['.svg', '.webp', '.jpg', '.jpeg', '.gif', '.bmp', '.ico']:
        try:
            print(f"\nConverting {filename}...")
            
            # Move original to old directory
            original_path = os.path.join('old', filename)
            shutil.copy2(filename, original_path)
            print(f"  Saved original to old/{filename}")
            
            # Open and convert image
            img = Image.open(filename)
            original_size = img.size
            original_mode = img.mode
            print(f"  Original: {original_size[0]}x{original_size[1]}, mode: {original_mode}")
            
            # Ensure alpha channel
            img = ensure_alpha_channel(img)
            
            # Save as PNG
            png_filename = f"{name}.png"
            img.save(png_filename, 'PNG')
            print(f"  ✓ Saved as {png_filename} ({img.size[0]}x{img.size[1]}, {img.mode})")
            
            # Remove original
            os.remove(filename)
            print(f"  Removed original {filename}")
            
            return True
            
        except Exception as e:
            print(f"  ✗ Error converting {filename}: {e}")
            return False
    
    print(f"  ⏭ Skipping {filename} (unknown format)")
    return False

def main():
    """Process all files in the logos directory."""
    print("Converting logos to PNG with alpha channel...\n")
    
    # Get all files (not directories)
    files = [f for f in os.listdir('.') if os.path.isfile(f) and not f.startswith('.')]
    files.sort()
    
    if not files:
        print("No files found in current directory.")
        return
    
    print(f"Found {len(files)} files to process:\n")
    
    converted = 0
    processed = 0
    
    for filename in files:
        # Skip Python scripts
        if filename.endswith('.py'):
            continue
            
        processed += 1
        if convert_file_to_png(filename):
            if not filename.lower().endswith('.png'):
                converted += 1
    
    print(f"\n{'='*60}")
    print(f"Processed {processed} files")
    if converted > 0:
        print(f"Converted {converted} files to PNG")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()

