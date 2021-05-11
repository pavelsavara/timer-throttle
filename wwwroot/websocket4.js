let start;
var nextMessageId = 0;
var lastHit;


var lastChainedAt = 0
var bestTickId = -1
var bestTickIsSocket = false
let next = {}

let socket = new WebSocket("ws://localhost:5000/ws");

document.addEventListener("visibilitychange", () => {
    if (document.hidden && nextMessageId == 0) {
        console.log('Start');
        start = new Date().valueOf();
        lastHit = start;
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
        nextMessageId++
        let candidateMessageId = nextMessageId

        let betterCandidate = isSocket
            ? now > lastChainedAt
            : !bestTickIsSocket && now - 50 > lastChainedAt
        if (betterCandidate) {
            // i'm your best candidate so far in this tick
            bestTickId = candidateMessageId
            bestTickIsSocket = isSocket
        }
        // wait for all candidates to sort in this tick
        setTimeout(() => {
            let shouldChain = bestTickId == candidateMessageId // I win the selection
            if (shouldChain) { 
                lastChainedAt = now

                socket.send(JSON.stringify({ messageId, chainCount, isSocket, time }))

                //reset tick state
                bestTickIsSocket = false
                bestTickId = 0

                setTimeoutChain({ messageId: nextMessageId, chainCount: chainCount + 1, isSocket: false, time: now });
            }
            work(now, { messageId, chainCount, isSocket, time }, shouldChain)
        }, 1);
    }, 100);
}

function work(now, { messageId, chainCount, isSocket, time }, shouldChain) {
    let sinceLast = now - lastHit;
    let sinceStart = now - start;
    let sinceParent = now - time;
    if (document.hidden || shouldChain) {
        console.log(`${messageId}, ${chainCount},${isSocket} at ${Math.round(sinceStart / 1000)}s from start, ${sinceLast}ms from last, ${sinceParent}ms from parent -> shouldChain: ${shouldChain}, ${now}`);
    }
    lastHit = now;
}
