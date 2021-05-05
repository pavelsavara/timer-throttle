# Heavy throttling of chained JS timers beginning in Chrome 88

https://developer.chrome.com/blog/timer-throttling-in-chrome-88/

Tested on Windows Chrome Version 90.0.4430.93 (Official Build) (64-bit)
- `index.html` - iframe out of visible area is not making it "hidden page" 
- `dummy.js` - timer callbacks are slowed to 1000ms after 3 seconds of being hidden
- `websocket.js` timer callbacks are slowed to 60 000ms after 5 minutes of being hidden, even when there is WebSocket on the page, but it doesn't participate in timer queue
- `websocket2.js` timer callbacks are slowed only to **1 000ms** after **417 seconds** of being hidden, when WebSocket.message is also scheduling the next timer


Part of output of `websocket2.js`
```
1200 at 404.127s from start, 992ms from last fast, 992ms from last
1201 at 405.124s from start, 987ms from last fast, 987ms from last
1202 at 406.123s from start, 987ms from last fast, 987ms from last
1203 at 407.114s from start, 982ms from last fast, 982ms from last
1204 at 408.125s from start, 1001ms from last fast, 1001ms from last
1205 at 409.123s from start, 987ms from last fast, 987ms from last
1206 at 410.122s from start, 989ms from last fast, 989ms from last
1207 at 411.123s from start, 991ms from last fast, 991ms from last
1208 at 412.118s from start, 985ms from last fast, 985ms from last
1209 at 413.116s from start, 987ms from last fast, 987ms from last
1210 at 414.127s from start, 1002ms from last fast, 1002ms from last
1211 at 415.122s from start, 990ms from last fast, 990ms from last
1212 at 416.128s from start, 996ms from last fast, 996ms from last
1213 at 417.117s from start, 976ms from last fast, 976ms from last
1 at 418.117s from start, 984ms from last fast, 984ms from last
2 at 419.116s from start, 999ms from last fast, 999ms from last
3 at 420.128s from start, 1011ms from last fast, 1011ms from last
4 at 421.125s from start, 996ms from last fast, 996ms from last
4 at 422.123s from start, 997ms from last fast, 997ms from last
```