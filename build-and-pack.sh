#!/bin/bash -eux

set +o pipefail

mkdir -p dist
GOOS=js GOARCH=wasm go build -buildvcs=false -o dist/main.wasm

pushd dist
cp --no-preserve=all ../frontend.html packed.html
tee -a packed.html >/dev/null <<<""
tee -a packed.html >/dev/null <<<"<script>"
tee -a packed.html >/dev/null <"$(go env GOROOT)/misc/wasm/wasm_exec.js"
tee -a packed.html >/dev/null <<<""
tee -a packed.html >/dev/null <<<"window.wasmURL = 'data:application/wasm;base64,$(base64 -w 0 main.wasm)';"
tee -a packed.html >/dev/null <<<""
tee -a packed.html >/dev/null <../main.js
tee -a packed.html >/dev/null <<<"</script>"
popd
