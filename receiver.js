const amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

amqp.connect('amqp://localhost', function (err0, connection) {
    if (err0) {
        throw err0;
    }

    connection.createChannel(function (err1, channel) {
        if (err1) {
            throw err1;
        }

        let exchange = 'queue';

        channel.assertExchange(exchange, 'direct', {durable: false});

        channel.assertQueue('', {exclusive: true}, function (err2, q) {
            if (err2) {
                throw err2;
            }

            console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue);

            channel.bindQueue(q.queue, exchange, '');
            if (args[0]) {
                channel.bindQueue(q.queue, exchange, args[0]);
            }

            channel.consume(q.queue, function (msg) {
                if (msg.content) {
                    console.log(' [x] Received %s', msg.content.toString());

                    if (args[1]) {
                        channel.sendToQueue(msg.properties.replyTo, Buffer.from(args[1]), {
                            correlationId: msg.properties.correlationId
                        })
                    }
                }
            }, {
                noAck: true
            });
        });
    });
});