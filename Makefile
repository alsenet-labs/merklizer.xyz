.PHONY: all merklizer merklizer.xyz unsafe-build safe-build

all: safe-build

unsafe-build: merklizer merklizer.xyz

merklizer.xyz: merklizer
	yarn && gulp gh-pages

merklizer:
	cd merklizer && make webapp-ugly 

safe-build: 
	cd nodejs-docker \
  &&  docker build . -t nodejs \
  && cd .. \
  && ./safe-build.sh merklizer.xyz 2>&1

