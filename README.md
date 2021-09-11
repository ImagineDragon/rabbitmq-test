# rabbitmq-test

### requirements 
```
node v14.17.6
Erlang v24.0.6
RabbitMQ  v3.9.5
```
### installation
```
npm i
```
### start services
```
node sender.js {{queue_name}} --withresponse
```
sender.js - service for producing messages. Producing interval = 5s.

queue_name - queue name for direct producing

--withresponse - flag for getting consumer response 
```
node receiver.js {{queue_name}} {{response_text}}
```
receiver.js - service for consuming messages

queue_name - queue name for direct consuming

response_text - text to send in response 
