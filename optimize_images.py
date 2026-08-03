import os
from PIL import Image

def optimize_image(input_name, output_name, max_dim=1000, quality=80):
    img_dir = os.path.join("assets", "img")
    input_path = os.path.join(img_dir, input_name)
    output_path = os.path.join(img_dir, output_name)
    
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return
        
    try:
        with Image.open(input_path) as img:
            # Get original size in bytes
            orig_size = os.path.getsize(input_path)
            
            # Keep original format's color mode compatibility
            if img.mode in ('RGBA', 'LA') and output_name.lower().endswith('.jpg'):
                # Convert transparent images to RGB if saving to JPEG
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])
                img = background
            
            # Scale down if dimensions are larger than max_dim
            w, h = img.size
            if max(w, h) > max_dim:
                if w > h:
                    new_w = max_dim
                    new_h = int(h * (max_dim / w))
                else:
                    new_h = max_dim
                    new_w = int(w * (max_dim / h))
                
                try:
                    resample_method = Image.Resampling.LANCZOS
                except AttributeError:
                    resample_method = Image.ANTIALIAS
                    
                img = img.resize((new_w, new_h), resample_method)
                print(f"Resized {input_name} from {w}x{h} to {new_w}x{new_h}")
            
            # Save as WebP
            img.save(output_path, 'WEBP', quality=quality, method=6)
            new_size = os.path.getsize(output_path)
            
            reduction = (orig_size - new_size) / orig_size * 100
            print(f"Optimized: {input_name} -> {output_name}")
            print(f"  Size: {orig_size/1024/1024:.2f}MB -> {new_size/1024:.2f}KB ({reduction:.1f}% reduction)")
    except Exception as e:
        print(f"Error optimizing {input_name}: {e}")

if __name__ == "__main__":
    images_to_optimize = [
        # (input_filename, output_filename)
        ("profile.jpg", "profile.webp"),
        ("chillen.jpg", "chillen.webp"),
        ("nss.jpg", "nss.webp"),
        ("IoT.jpg", "IoT.webp"),
        ("pfp1.jpg", "pfp1.webp"),
        ("GYM.jpg", "gym.webp"), # Note: outputting lowercase gym.webp
        ("tech.jpg", "tech.webp"),
    ]
    
    print("Starting image optimization...")
    for input_name, output_name in images_to_optimize:
        optimize_image(input_name, output_name)
    print("Image optimization complete.")
