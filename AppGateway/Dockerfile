FROM node:12

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .
# COPY package*.json ./

ARG REACT_APP_ZUGRIFF
ARG REACT_APP_PERSONEN
ARG REACT_APP_TURNIER
ARG REACT_APP_MANNSCHAFT

ENV REACT_APP_ZUGRIFF $REACT_APP_ZUGRIFF
ENV REACT_APP_PERSONEN $REACT_APP_PERSONEN
ENV REACT_APP_TURNIER $REACT_APP_TURNIER
ENV REACT_APP_MANNSCHAFT $REACT_APP_MANNSCHAFT

WORKDIR /usr/src/app/Frontend
RUN npm install
RUN npm run build

WORKDIR /usr/src/app/Backend
RUN npm install
WORKDIR /usr/src/app
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 3000

CMD [ "node", "./Backend/App.js" ]