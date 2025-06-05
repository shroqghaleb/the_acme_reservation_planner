const express = require("express");
const app = express();
const pg = require("pg");
const {
  client
} = require('./db');

app.use(express.json());

app.use('/api', require('./api'));

const init = async () => {
  await client.connect()
  
  const init = async()=> {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
};

init();