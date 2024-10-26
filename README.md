# Selfish

On-browser offline generator of self-signed personal certificate

# Build

```
docker run --rm -t -v "$(pwd):/data" -w /data golang ./build-and-pack.sh
```

Open `dist/packed.html` with your web browser.

# Format JavaScripts

```
docker run --rm -t -v "$(pwd):/data" -w /data node bash -c 'yarn; yarn prettier; yarn lint'
```
