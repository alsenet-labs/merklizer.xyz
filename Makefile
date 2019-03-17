.PHONY: gh-pages dist merklizer

all: merklizer merklizer.xyz

merklizer.xyz: merklizer
	yarn && gulp gh-pages

merklizer:
	cd merklizer && make webapp-ugly 

