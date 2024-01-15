const express = require("express");
const { performance } = require("perf_hooks");

const app = express();
const port = 3000;

function logClose(req, res, startTime) {
    const time = ((performance.now() - startTime) / 1000).toFixed(3);
    const statusCode = res.writableEnded ? res.statusCode : 499;

    console.log(
        "Response [] %s %d %s %ss (%s)",
        req.method,
        statusCode,
        req.originalUrl,
        time,
        res.headersSent ? "sent" : "not sent"
    );
}

app.use((req, res, next) => {
    const startTime = performance.now();
    console.log("---------------------------");
    console.log("-> got request", new Date());

    res.on("close", () => logClose(req, res, startTime));

    next();
});

app.get("/", (req, res) => {
    setTimeout(() => {
        res.send("Hello World!");
        console.log("<- controller was finished", new Date());
    }, 2000);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
