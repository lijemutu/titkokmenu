import sys
import os
from PIL import Image, ImageDraw

def add_logo_to_qr(qr_path, logo_path, output_path):
    if not os.path.exists(qr_path):
        print(f"Error: QR file {qr_path} not found.")
        sys.exit(1)
    if not os.path.exists(logo_path):
        print(f"Error: Logo file {logo_path} not found.")
        sys.exit(1)
        
    # Open images
    qr_img = Image.open(qr_path).convert("RGBA")
    logo_img = Image.open(logo_path).convert("RGBA")
    
    qr_w, qr_h = qr_img.size
    
    # 1. Round the outer borders of the QR code itself
    # A radius of 40px is highly visible and completely safe for position markers
    outer_radius = 40 
    mask = Image.new("L", (qr_w, qr_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (qr_w - 1, qr_h - 1)], radius=outer_radius, fill=255)
    
    # Create the transparent canvas and paste QR through the mask
    rounded_qr = Image.new("RGBA", (qr_w, qr_h), (0, 0, 0, 0))
    rounded_qr.paste(qr_img, (0, 0), mask=mask)
    
    # Draw a thick black border around the outer edges of the rounded QR code
    draw_outer = ImageDraw.Draw(rounded_qr)
    draw_outer.rounded_rectangle(
        [(0, 0), (qr_w - 1, qr_h - 1)],
        radius=outer_radius,
        fill=None,
        outline=(0, 0, 0, 255),
        width=10 # Thick, bold outer border to give high impact
    )
    
    # 2. Add the larger, square center logo badge (sharp corners, no border)
    # Size: Increased to 31% of the QR code dimensions (bold, highly visible)
    badge_size_pct = 0.31
    badge_w = int(qr_w * badge_size_pct)
    badge_h = int(qr_h * badge_size_pct)
    
    # Center coordinates
    bx = (qr_w - badge_w) // 2
    by = (qr_h - badge_h) // 2
    
    # Colors: White background, no border
    badge_color = (255, 255, 255, 255)
    
    # Create the square badge (no rounded corners)
    badge = Image.new("RGBA", (badge_w, badge_h), badge_color)
    
    # Resize and center the logo inside the badge
    # Padding: 6% of badge size (smaller padding = extremely large logo!)
    padding = int(min(badge_w, badge_h) * 0.06)
    logo_max_w = badge_w - 2 * padding
    logo_max_h = badge_h - 2 * padding
    
    # Maintain logo aspect ratio
    logo_aspect = logo_img.width / logo_img.height
    if logo_max_w / logo_max_h > logo_aspect:
        logo_w = int(logo_max_h * logo_aspect)
        logo_h = logo_max_h
    else:
        logo_w = logo_max_w
        logo_h = int(logo_max_w / logo_aspect)
        
    logo_resized = logo_img.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    
    # Paste logo in center of badge
    lx = (badge_w - logo_w) // 2
    ly = (badge_h - logo_h) // 2
    badge.paste(logo_resized, (lx, ly), logo_resized)
    
    # 3. Paste the completed square badge onto the center of the rounded QR code
    rounded_qr.paste(badge, (bx, by), badge)
    
    # Save output
    rounded_qr.save(output_path, "PNG")
    print(f"Branded QR saved successfully: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python overlay_logo.py <qr_path> <logo_path> <output_path>")
        sys.exit(1)
        
    qr_path = sys.argv[1]
    logo_path = sys.argv[2]
    output_path = sys.argv[3]
    
    add_logo_to_qr(qr_path, logo_path, output_path)
