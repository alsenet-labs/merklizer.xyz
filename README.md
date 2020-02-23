# merklizer.xyz

Web interface integrating [https://github.com/alsenet-labs/merklizer](https://github.com/alsenet-labs/merklizer)

See it in action on https://merklizer.xyz

## Copyright
 Copyright (c) 2018-2019 ALSENET SA

## Authors
  * Alexandre Poltorak <polto@alsenet.com>
  * Luc Deschenaux <luc.deschenaux@freesurf.ch>

## Licence
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

## Build

You can build the static webpages in a docker container with
```
env NODE_VERSION=v10 make  # NB: the remote repository will be used for the build
```
Then you can bind or copy the dist directory somewhere, on linux it is located at
```
/var/lib/docker/volumes/merklizer.xyz/_data/dist
```
On the other hand you can build the static webpages on your host from the local repository, at your risks and perils:
```
make unsafe-build
```

## Clean
When you are finished, you can remove the docker container with eg
``` 
docker rm merklizer.xyz
```
or the associated docker volume with
```
docker volume rm merklizer.xyz
```

Check the docker documentation for more.

## Work in the container (git, gulp...)
### Restart the container with eg
```
docker start merklizer.xyz
```
### Run a shell in the container with eg
```
docker exec -it merklizer.xyz /bin/bash -l
```
or eg
```
docker exec -it merklizer.xyz /bin/bash -l -e 'screen -s /bin/bash'
```

#### Update gh-pages
eg after rebuilding the container, with: 
```
docker start merklizer.xyz -ai << EOF
cd /home/nodejs/src/merklizer.xyz
git config user.name "$(git config user.name)"
git config user.email "$(git config user.email)"
git add docs
git commit docs -m "update gh-pages"
git push origin master
EOF
```

### Run and test web application with eg
```
docker start merklizer.xyz -ai << EOF
cd /home/nodejs/src/merklizer.xyz
gulp
EOF
```
