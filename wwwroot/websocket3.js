let start;
var nextMessageId = 0;
var lastHit;
var lastFast;
var lastMessageIdChainedFrom = -1;
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
        let shouldChain = isSocket || messageId > lastMessageIdChainedFrom
        work(now, { messageId, chainCount, isSocket, time }, shouldChain)
        if (shouldChain) {
            socket.send(JSON.stringify({ messageId, chainCount, isSocket, time }))
            lastMessageIdChainedFrom = messageId
            nextMessageId++
            setTimeoutChain({ messageId: nextMessageId, chainCount: chainCount + 1, isSocket: false, time: now });
        }
    }, 100);
}

function work(now, { messageId, chainCount, isSocket, time }, shouldChain) {
    let sinceLast = now - lastHit;
    let sinceStart = now - start;
    let sinceFast = now - lastFast;
    let sinceParent = now - time;
    if (document.hidden) {
        console.log(`${messageId}, ${chainCount},${isSocket} at ${Math.round(sinceStart / 1000)}s from start, ${Math.round(sinceFast / 1000)}s from last fast, ${sinceLast}ms from last, ${sinceParent}ms from parent -> shouldChain: ${shouldChain}`);
    }
    lastHit = now;
}
