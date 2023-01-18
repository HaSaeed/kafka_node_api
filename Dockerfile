FROM node:18.12.1

RUN apt-get update -y \
    && apt install default-jre default-jdk -y \
    && wget https://downloads.apache.org/kafka/3.3.1/kafka_2.13-3.3.1.tgz \
    && tar -xvf kafka_2.13-3.3.1.tgz --directory /

COPY src/index.js  /chat/src/
COPY package.json /chat/
COPY entrypoint.sh /chat/

RUN cd /chat \
    && npm install package.json

ENTRYPOINT      ["/chat/entrypoint.sh"]
EXPOSE          3000