FROM debian:stretch
ARG debian_mirror=deb.debian.org
RUN sed -r -i -e s/deb.debian.org/$debian_mirror/ /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y --force-yes \
      build-essential \
      bzip2 \
      ca-certificates \
      curl \
      git \
      wget \
      python \
      libexpat1-dev \
      ruby2.3 \
      ruby2.3-dev \
      vim \
      screen \
      net-tools \
      libssl-dev \
 && gem install \
      compass \
      sass
ARG user=nodejs
ARG uid=2000
ARG gid=2000
RUN addgroup --gid $gid $user && useradd -u $uid -g $uid --create-home --shell /bin/bash $user
USER $user
WORKDIR /home/$user
ARG node_version=--lts
RUN export NVM_DIR="/home/$user/.nvm" \
 && git clone https://github.com/creationix/nvm.git "$NVM_DIR" \
 && cd "$NVM_DIR" \
 && git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)` \
 && cd \
 && \. "$NVM_DIR/nvm.sh" \
 && echo 'export NVM_DIR="$HOME/.nvm"' >> .profile \
 && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> .profile \
 && nvm install $node_version \
 && echo progress=false >> .npmrc \
 && npm install -g npm \
      yarn \
      grunt-cli \
      gulp@4 \
 && mkdir src
EXPOSE 3000-3001
CMD bash -l
