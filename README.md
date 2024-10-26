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

# Maintenance: Bump the dependencies to the latest

```
docker run --rm -t -v "$(pwd):/data" -w /data golang bash -c 'go get -u; go mod tidy'
docker run --rm -t -v "$(pwd):/data" -w /data node yarn upgrade --latest
```
