let start;
var nextMessageId = 0;
var lastHit;
var lastFast;


var tickUnique = 0
var lastChainedAt = 0
var lastTickId = -1
var lastTickIsSocket = false
let next = {}

let socket = new WebSocket("ws://localhost:5000/ws");

document.addEventListener("visibilitychange", () => {
    if (document.hidden && nextMessageId == 0) {
        console.log('Start');
        start = new Date().valueOf();
        lastHit = start;
        lastFast = start;
        nextMessageId++
        lastSocketId = nextMessageId;
        setTimeoutChain({ messageId: nextMessageId, chainCount: 0, isSocket: false, time: start });
    }
}, false);

socket.addEventListener('message', function (event) {
    let { time } = JSON.parse(event.data)
    nextMessageId++
    let now = new Date().valueOf();
    setTimeoutChain({ messageId: nextMessageId, chainCount: 0, isSocket: true, time: now });
});

function setTimeoutChain({ messageId, chainCount, isSocket, time }) {
    setTimeout(() => {
        let now = new Date().valueOf();
        tickUnique++
        let tickId = tickUnique
        if (now > lastChainedAt && (!lastTickIsSocket || isSocket)) {
            // i'm your best candidate yet
            lastChainedAt = now
            lastTickId = tickId
            lastTickIsSocket = isSocket
        }
        // wait for all candidates to sort in this tick
        setTimeout(() => {
            // console.log({lastChainedAt, now, lastTickId, tickId})
            let shouldChain = lastChainedAt == now && lastTickId == tickId
            if (shouldChain) { // I win the selection
                socket.send(JSON.stringify({ messageId, chainCount, isSocket, time }))

                //reset tick state
                tickUnique = 0
                lastTickIsSocket = false

                nextMessageId++
                setTimeoutChain({ messageId: nextMessageId, chainCount: chainCount + 1, isSocket: false, time: now });
            }
            work(now, { messageId, chainCount, isSocket, time }, shouldChain)
        }, 0);
    }, 100);
}

function work(now, { messageId, chainCount, isSocket, time }, shouldChain) {
    let sinceLast = now - lastHit;
    let sinceStart = now - start;
    let sinceFast = now - lastFast;
    let sinceParent = now - time;
    if (document.hidden || shouldChain) {
        console.log(`${messageId}, ${chainCount},${isSocket} at ${Math.round(sinceStart / 1000)}s from start, ${Math.round(sinceFast / 1000)}s from last fast, ${sinceLast}ms from last, ${sinceParent}ms from parent -> shouldChain: ${shouldChain}`);
    }
    lastHit = now;
}
