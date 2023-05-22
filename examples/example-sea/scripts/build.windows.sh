#/bin/bash

# Generate the blob to be injected.
node --experimental-sea-config sea-config.json

# Copy the node executable.
cp (Get-Command node).Source example.exe

# Remove the signature of the binary.
signtool remove /s example.exe 

# Inject the blob into the copied binary.
npx postject example.exe NODE_SEA_BLOB out/sea.blob \
  --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

# Sign the binary. A certificate needs to be present for this to work.
signtool sign /fd SHA256 example.exe
