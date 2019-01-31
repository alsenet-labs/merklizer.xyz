.PHONY: gh-pages dist merklizer

all: merklizer dist gh-pages

gh-pages: dist
	rsync -zav dist/ docs/

dist: merklizer
	yarn && gulp dist

merklizer:
	cd merklizer && make webapp-ugly 

