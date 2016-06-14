FROM        earvin/nodejs:latest
MAINTAINER  Earvin Kayonga <earvin@earvinkayonga.com>

COPY        . src/

WORKDIR     src/

RUN         npm install

CMD         ["-e",  "server.js"]
