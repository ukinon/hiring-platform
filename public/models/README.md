# TensorFlow.js Handpose Model

To fix the Kaggle URL expiration issue, download the model files manually:

## Steps:

1. Download the model files from one of these sources:

   - **Option A (Official)**: https://storage.googleapis.com/tfjs-models/savedmodel/handpose/model.json
   - **Option B (jsDelivr CDN)**: https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.6/dist/

2. Place all files in `public/models/handpose/`:

   - `model.json`
   - All `.bin` files (group1-shard1of1.bin, etc.)

3. The app will automatically use these local files instead of the Kaggle URL.

## Quick Fix Script:

```bash
# Run this in your terminal
cd public/models/handpose
curl -O https://storage.googleapis.com/tfjs-models/savedmodel/handpose/model.json
# Download all the .bin files referenced in model.json
```

Alternatively, you can use this direct download link:
https://github.com/tensorflow/tfjs-models/tree/master/handpose
