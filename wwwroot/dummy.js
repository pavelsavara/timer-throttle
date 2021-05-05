let start = new Date();
var lastHit = start;
var lastFast = start;

function setTimeoutChain(chainCount) {
    setTimeout(() => {
        let now = new Date();
        let delay = now.valueOf() - lastHit.valueOf();
        let sinceStart = now.valueOf() - start;
        if (delay > 600) {
            console.log(`Dummy ${chainCount} at ${sinceStart/1000} seconds, ${delay}ms from last`);
        }
        else{
            lastFast = now;
        }
        lastHit = now;
        setTimeoutChain(chainCount+1);
    }, 100);
}

console.log('Start');
setTimeoutChain(1);