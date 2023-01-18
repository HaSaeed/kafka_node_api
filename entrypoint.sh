#!/bin/bash -e

sleep 2
/kafka_2.13-3.3.1/bin/zookeeper-server-start.sh /kafka_2.13-3.3.1/config/zookeeper.properties &
sleep 2
/kafka_2.13-3.3.1/bin/kafka-server-start.sh /kafka_2.13-3.3.1/config/server.properties &
sleep 2
/kafka_2.13-3.3.1/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --topic my-topic &
sleep 2
node /chat/src/