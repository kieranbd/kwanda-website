#!/usr/bin/env python3
"""
Convert SVG files to PNG preserving original dimensions and aspect ratio.
"""

import os
import xml.etree.ElementTree as ET
from PIL import Image
import subprocess
import sys

def get_svg_dimensions(svg_path):
    """Extract dimensions from SVG file."""
    try:
        tree = ET.parse(svg_path)
        root = tree.getroot()
        
        # Check for width and height attributes
        width = root.get('width')
        height = root.get('height')
        viewbox = root.get('viewBox')
        
        # If width/height are specified, use them
        if width and height:
            # Remove units and convert to int
            width = float(width.replace('px', '').replace('pt', ''))
            height = float(height.replace('px', '').replace('pt', ''))
            return int(width), int(height)
        
        # Otherwise use viewBox
        if viewbox:
            parts = viewbox.split()
            if len(parts) >= 4:
                # viewBox format: "x y width height"
                vb_width = float(parts[2])
                vb_height = float(parts[3])
                # Scale to reasonable size (maintain aspect ratio)
                if vb_width > 1000:
                    scale = 1000 / vb_width
                    return int(vb_width * scale), int(vb_height * scale)
                return int(vb_width), int(vb_height)
        
        return None, None
    except Exception as e:
        print(f"  Warning: Could not parse SVG dimensions: {e}")
        return None, None

def convert_svg_with_qlmanage(svg_path, output_png, width=None, height=None):
    """Convert SVG to PNG using qlmanage with specific dimensions."""
    try:
        # If dimensions provided, we need to calculate a size that qlmanage can use
        if width and height:
            # qlmanage uses -s for thumbnail size in pixels
            # Use the larger dimension to ensure we don't crop
            size = max(width, height)
            # Make it larger to avoid any edge cropping (2x for safety)
            size = int(size * 2)
        else:
            size = 2000  # Large default size
        
        # Get directory and filename
        svg_dir = os.path.dirname(os.path.abspath(svg_path))
        svg_name = os.path.basename(svg_path)
        
        # Run qlmanage on the SVG file
        result = subprocess.run(
            ['qlmanage', '-t', '-s', str(size), '-o', svg_dir, svg_path],
            cwd=svg_dir,
            capture_output=True,
            text=True
        )
        
        # Find the generated PNG (qlmanage creates filename.svg.png)
        expected_name = os.path.join(svg_dir, svg_name + '.png')
        if os.path.exists(expected_name):
            img = Image.open(expected_name)
            original_size = img.size
            print(f"  qlmanage created: {original_size[0]}x{original_size[1]}")
            
            # If we have target dimensions, resize to match exactly without cropping
            if width and height:
                target_ratio = width / height
                current_ratio = original_size[0] / original_size[1]
                
                # If aspect ratios don't match, we need to resize while preserving ratio
                # Then add transparent padding if needed (don't crop)
                if abs(current_ratio - target_ratio) > 0.01:
                    # Calculate new size that fits within target dimensions
                    if current_ratio > target_ratio:
                        # Image is wider, fit to height
                        new_height = height
                        new_width = int(height * current_ratio)
                    else:
                        # Image is taller, fit to width
                        new_width = width
                        new_height = int(width / current_ratio)
                    
                    # Resize maintaining aspect ratio
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Create a new image with target dimensions and transparent background
                    final_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
                    
                    # Center the resized image
                    x_offset = (width - new_width) // 2
                    y_offset = (height - new_height) // 2
                    final_img.paste(img, (x_offset, y_offset), img)
                    img = final_img
                else:
                    # Aspect ratios match, just resize
                    img = img.resize((width, height), Image.Resampling.LANCZOS)
            else:
                # No target dimensions, just use what qlmanage created
                pass
            
            # Ensure RGBA
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            img.save(output_png, 'PNG')
            print(f"  Final size: {img.size[0]}x{img.size[1]}")
            os.remove(expected_name)
            return True
        else:
            print(f"  Error: qlmanage did not create expected file: {expected_name}")
            return False
            
    except Exception as e:
        print(f"  Error with qlmanage: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Convert SVG files to PNG."""
    svg_files = ['copilot.svg', 'pinecone.svg', 'ffmpeg.svg']
    
    for svg_file in svg_files:
        svg_path = os.path.join('old', svg_file)
        if not os.path.exists(svg_path):
            print(f"✗ {svg_path} not found")
            continue
        
        png_name = svg_file.replace('.svg', '.png')
        print(f"\nConverting {svg_file}...")
        
        # Get original dimensions
        width, height = get_svg_dimensions(svg_path)
        if width and height:
            print(f"  Original dimensions: {width}x{height}")
        else:
            print(f"  Warning: Could not determine dimensions, using default")
            width, height = 2000, 1000  # Safe defaults
        
        # Copy to current dir temporarily for qlmanage
        temp_svg = svg_file
        import shutil
        shutil.copy2(svg_path, temp_svg)
        
        # Convert with qlmanage
        if convert_svg_with_qlmanage(temp_svg, png_name, width, height):
            print(f"  ✓ Created {png_name}")
        else:
            print(f"  ✗ Failed to convert {svg_file}")
        
        # Clean up temp file
        if os.path.exists(temp_svg):
            os.remove(temp_svg)

if __name__ == '__main__':
    main()

