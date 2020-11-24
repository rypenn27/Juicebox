const express = require("express");
const apiRouter = express.Router();

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const apiRouter = require("./api");
server.use("/api", apiRouter);

module.exports = apiRouter;
