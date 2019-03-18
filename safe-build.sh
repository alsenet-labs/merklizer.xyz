#!/bin/bash
set -e
set -x
docker run --rm --name merklizer.xyz --mount source=merklizer.xyz,destination=/home/nodejs/src/merklizer.xyz -u root nodejs chown nodejs.nodejs src/merklizer.xyz
docker run --name merklizer.xyz --mount source=merklizer.xyz,destination=/home/nodejs/src/merklizer.xyz -i nodejs << 'EOF'
set -x
cd src/merklizer.xyz
[ -d .git ] || git clone --recursive https://github.com/alsenet-labs/merklizer.xyz .
make unsafe-build && echo "The package is available in /var/lib/docker/volumes/merklizer.xyz/_data/dist"
EOF
