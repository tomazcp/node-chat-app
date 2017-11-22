const path                  = require('path'),
      express               = require('express'),
      socketIO              = require('socket.io'),
      http                  = require('http'),
      {generateMessage}     = require('./utils/message');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('newMessage', {
    //     text: 'This is a message.',
    //     from: 'Tomás',
    //     createdAt: '512545'
    // });
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('New message: ', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        // aknowledgement by the server console.log('got it') on the client console
        // send data back by providing one argument inside the callback()
        callback('This is from the server');
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// cenas
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
