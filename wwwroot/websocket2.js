let start = new Date();
var lastHit = start;
var lastFast = start;

let socket = new WebSocket("ws://localhost:5000/ws");

socket.addEventListener('open', function (event) {
    socket.send('Hello Server2!');
});

socket.addEventListener('message', function (event) {
    console.log("Received2: " + event.data);
    setTimeoutChain(1);
});

function setTimeoutChain(chainCount) {
    setTimeout(() => {
        let now = new Date();
        let sinceLast = now.valueOf() - lastHit.valueOf();
        let sinceStart = now.valueOf() - start;
        let sinceFast = now.valueOf() - lastFast;
        if (sinceLast > 600) {
            let message = `${chainCount} at ${sinceStart / 1000}s from start, ${sinceFast}ms from last fast, ${sinceLast}ms from last`;
            console.log("Sent2: " + message);
            socket.send(message)
        }
        else {
            lastFast = now;
        }
        lastHit = now;
        setTimeoutChain(chainCount+1);
    }, 100);
}

console.log('Start');
setTimeoutChain(1);