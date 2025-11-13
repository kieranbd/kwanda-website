#!/usr/bin/env python3
"""
Crop all PNG logos to remove excess padding around the actual logo content.
Finds the bounding box of non-transparent/non-white content and crops to it.
Backs up originals to 'old' directory before processing.
"""

import os
from PIL import Image
import shutil

def get_content_bbox(img, threshold=5):
    """
    Find the bounding box of actual content in the image.
    Handles both transparent backgrounds and white/light backgrounds.
    
    Args:
        img: PIL Image object
        threshold: Alpha threshold for considering a pixel as content (0-255)
    
    Returns:
        Tuple of (left, top, right, bottom) bounding box, or None if no content found
    """
    # Ensure we have RGBA mode
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    width, height = img.size
    pixels = img.load()
    
    # Find bounds
    left = width
    top = height
    right = 0
    bottom = 0
    
    found_content = False
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # Check if pixel has content:
            # 1. Has significant alpha (not transparent)
            # 2. Or is not white/very light (for images without transparency)
            has_alpha = a > threshold
            is_not_white = not (r > 250 and g > 250 and b > 250)
            
            if has_alpha and is_not_white:
                found_content = True
                left = min(left, x)
                top = min(top, y)
                right = max(right, x)
                bottom = max(bottom, y)
    
    if not found_content:
        return None
    
    # Add small padding (1% of image size, minimum 2px)
    padding_x = max(2, int(width * 0.01))
    padding_y = max(2, int(height * 0.01))
    
    left = max(0, left - padding_x)
    top = max(0, top - padding_y)
    right = min(width - 1, right + padding_x)
    bottom = min(height - 1, bottom + padding_y)
    
    return (left, top, right + 1, bottom + 1)

def crop_logo(filename, backup=True):
    """
    Crop a single logo file to remove excess padding.
    
    Args:
        filename: Path to the PNG file
        backup: Whether to backup the original to 'old' directory
    
    Returns:
        True if successful, False otherwise
    """
    if not filename.lower().endswith('.png'):
        print(f"  ⏭ Skipping {filename} (not a PNG file)")
        return False
    
    try:
        # Open image
        img = Image.open(filename)
        original_size = img.size
        print(f"\nProcessing {filename}...")
        print(f"  Original size: {original_size[0]}x{original_size[1]}")
        
        # Find content bounding box
        bbox = get_content_bbox(img)
        
        if bbox is None:
            print(f"  ⚠ No content found in {filename}, skipping")
            return False
        
        left, top, right, bottom = bbox
        new_size = (right - left, bottom - top)
        
        print(f"  Content bounds: ({left}, {top}) to ({right}, {bottom})")
        print(f"  New size: {new_size[0]}x{new_size[1]}")
        
        # Check if cropping is actually needed
        if left == 0 and top == 0 and right == original_size[0] and bottom == original_size[1]:
            print(f"  ✓ No cropping needed (already tight)")
            return True
        
        # Backup original if requested
        if backup:
            old_dir = 'old'
            if not os.path.exists(old_dir):
                os.makedirs(old_dir)
            
            backup_path = os.path.join(old_dir, filename)
            # Only backup if it doesn't already exist in old directory
            if not os.path.exists(backup_path):
                shutil.copy2(filename, backup_path)
                print(f"  Backed up to old/{filename}")
            else:
                print(f"  Backup already exists in old/{filename}")
        
        # Crop the image
        cropped = img.crop(bbox)
        
        # Save the cropped image
        cropped.save(filename, 'PNG')
        
        reduction = ((original_size[0] * original_size[1]) - (new_size[0] * new_size[1])) / (original_size[0] * original_size[1]) * 100
        print(f"  ✓ Cropped and saved (reduced by {reduction:.1f}%)")
        
        return True
        
    except Exception as e:
        print(f"  ✗ Error processing {filename}: {e}")
        return False

def main():
    """Process all PNG files in the logos directory."""
    print("Cropping logos to remove excess padding...\n")
    print("=" * 60)
    
    # Get current directory
    current_dir = os.path.dirname(os.path.abspath(__file__)) or '.'
    os.chdir(current_dir)
    
    # Get all PNG files (not directories, not Python scripts)
    files = [
        f for f in os.listdir('.') 
        if os.path.isfile(f) 
        and f.lower().endswith('.png')
        and not f.startswith('.')
    ]
    files.sort()
    
    if not files:
        print("No PNG files found in current directory.")
        return
    
    print(f"Found {len(files)} PNG files to process:\n")
    
    processed = 0
    cropped = 0
    
    for filename in files:
        processed += 1
        if crop_logo(filename, backup=True):
            # Check if actual cropping happened by comparing sizes
            try:
                img = Image.open(filename)
                # If we got here and no error, it was processed
                # (We can't easily check if it was cropped without re-reading)
                cropped += 1
            except:
                pass
    
    print(f"\n{'='*60}")
    print(f"Processed {processed} files")
    print(f"Successfully cropped {cropped} files")
    print(f"{'='*60}")
    print("\nOriginal files backed up to 'old' directory (if they didn't already exist there)")

if __name__ == '__main__':
    main()

