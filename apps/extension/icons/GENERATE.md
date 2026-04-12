# Generate Extension Icons

## Quick Method (Recommended)

### Option 1: Use Online Converter
1. Open `icon.svg` in this folder
2. Go to https://cloudconvert.com/svg-to-png
3. Upload `icon.svg`
4. Convert to PNG with these sizes:
   - 16x16 → Save as `icon16.png`
   - 48x48 → Save as `icon48.png`
   - 128x128 → Save as `icon128.png`
5. Save all files in this `icons/` folder

### Option 2: Use generate-icons.html
1. Open `generate-icons.html` in your browser
2. Click "Download All Icons"
3. Save the downloaded files to this folder

### Option 3: Use ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run:
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

### Option 4: Use Inkscape
```bash
inkscape icon.svg --export-filename=icon16.png --export-width=16 --export-height=16
inkscape icon.svg --export-filename=icon48.png --export-width=48 --export-height=48
inkscape icon.svg --export-filename=icon128.png --export-width=128 --export-height=128
```

## Temporary Workaround

If you can't generate icons right now, create simple placeholder files:

1. Open Paint/GIMP/Photoshop
2. Create 3 images:
   - 16x16 pixels
   - 48x48 pixels
   - 128x128 pixels
3. Fill with any color (purple recommended: #667eea)
4. Save as PNG files in this folder

## After Creating Icons

1. Verify files exist:
   - `apps/extension/icons/icon16.png`
   - `apps/extension/icons/icon48.png`
   - `apps/extension/icons/icon128.png`

2. Reload extension:
   - Go to `chrome://extensions/`
   - Click reload button on DSA Auto Sync
   - Extension should load successfully!

## Design Guidelines

- Use gradient: #667eea → #764ba2
- Include code brackets { }
- Add sync/refresh symbol
- Keep it simple and recognizable
- Ensure visibility at 16x16 size
