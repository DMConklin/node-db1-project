const express = require("express");
const accountsRouter = require('../routers/accounts-router')

const server = express();

server.use(express.json());
server.use(accountsRouter)

module.exports = server;
