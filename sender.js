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
        let msg = args[0] || 'Hello world';

        channel.assertExchange(exchange, 'direct', {durable: false});

        channel.assertQueue('', {exclusive: true}, function (err2, q) {
            if (err2) {
                throw err2;
            }

            const correlationId = Math.random().toString();

            sendMessages(channel, exchange, msg, correlationId, q.queue);

            if (args[1] == '--withresponse') {
                channel.consume(q.queue, function (msg) {
                    if (msg.properties.correlationId == correlationId) {
                        console.log(' [.] Got response %s', msg.content.toString());
                    }
                })
            }
        })
    });
});

function sendMessages(channel, exchange, msg, correlationId, replyTo) {
    let i = 0;
    setInterval(function () {
        message = msg + ' ' + i
        channel.publish(exchange, args[0] || '', Buffer.from(message), {correlationId, replyTo});
        console.log(' [x] Sent %s', message);
        i++;
    }, 5000);
}