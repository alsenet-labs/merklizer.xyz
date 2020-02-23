NODE_VERSION ?= --lts

.PHONY: all merklizer merklizer.xyz unsafe-build safe-build

all: safe-build

unsafe-build: merklizer merklizer.xyz

merklizer.xyz: merklizer
	yarn && gulp gh-pages

merklizer:
	cd merklizer && make webapp-ugly 

safe-build: 
	cd nodejs-docker \
  && docker build --build-arg node_version=$(NODE_VERSION) -t nodejs . \
  && cd .. \
  && ./safe-build.sh merklizer.xyz 2>&1

