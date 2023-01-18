This is a simple app to test the messaging functionality pf kafa.

To build this docker image just run the following command in this folder:
docker build -t kafka_node_api .

To run the image after it is built run the following command:
docker run -p 3000:3000 kafka_node_api

After running the image you can view the API in the browser using:
http://localhost:3000