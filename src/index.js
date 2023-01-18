const kafka = require('kafka-node');
const express = require('express')
const bodyParser = require('body-parser');

const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
const producer = new kafka.HighLevelProducer(client);
const Consumer = kafka.Consumer;

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <body> Add the messages below to send to kafka cluster <br> </body>

        <form id="message-form" method="post" action="/send_message">
            <input type="text" name="message" placeholder="Enter your message here">
            <button type="submit">Send</button>
        </form>

        <body> Fetch all kafka messages from the following link <br> </body>

        <a href='/messages'>Fetch Messages</a>

        <script>
            const form = document.getElementById('message-form');
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const message = event.target.elements.message.value;

                // Send the message to the server
                try {
                    const response = await fetch('/send_message', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });

                    const data = await response.json();
                    console.log(data);

                    // Update the page with the response
                    // add your own way to show feedback
                } catch (error) {
                    console.error(error);
                }
            });
        </script>
    `);
});


app.post('/send_message', (req, res) => {
    const message = req.body.message;
    console.log(message);
    const payloads = [{ topic: 'my-topic', messages: message }];
    producer.send(payloads, function (err, data) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(data);
        }
    });
});

app.get('/messages', function(req, res) {
    // Code to fetch the messages goes here

    const consumer = new Consumer(
      client,
      [{ topic: 'my-topic', partition: 0 }],
      {
        autoCommit: true,
        fetchMaxWaitMs: 250,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8',
        fromOffset: 'earliest'
      }
    );

    let messages = []
    consumer.on('message', function(message) {
        messages.push(message.value)
    });

    setTimeout(function() {
        res.send(messages);
    }, 750);

});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});


