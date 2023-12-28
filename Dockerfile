FROM node:18.7.0-alpine AS BUILD_IMAGE

# couchbase sdk requirements
RUN apk update && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# install dependencies
RUN yarn install --frozen-lockfile

COPY . .

# lint & test
RUN yarn lint

# build application
RUN yarn build

FROM node:18.7.0-alpine

# Python
RUN apk add --no-cache python3 python3-dev \
    linux-headers build-base bash git && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && \
    rm -r /root/.cache

# Timezone
RUN apk add --no-cache tzdata
ENV TZ UTC

# Installs latest Chromium (77) package.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app ./

EXPOSE 3000

CMD ["yarn", "run", "start:prod"]
