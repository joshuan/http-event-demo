const express = require("express");

const app = express();
const port = 3000;

function log(req, res, event) {
    const time = ((Date.now() - req.time) / 1000).toFixed(3);
    const statusCode = event === "close" ? 499 : res.statusCode;

    console.log(
        "Response [] %s %d %s %ss (%s, %s)",
        req.method,
        statusCode,
        req.originalUrl,
        time,
        event,
        res.headersSent ? "sent" : "not sent"
    );
}

function logFinish() {
    console.log("... req finish");
    // this.off("finish", logFinish);
    // this.off("close", logClose);
    log(this.req, this, "finish");
}

function logClose() {
    console.log("... req close");
    // this.off("finish", logFinish);
    // this.off("close", logClose);
    log(this.req, this, "close");
}

app.use((req, res, next) => {
    req.time = Date.now();
    res.req = req;
    console.log("---------------------------");
    console.log("-> got request", new Date());

    res.on("finish", logFinish);
    res.on("close", logClose);

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
