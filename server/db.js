const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner')
module.exports = {
  client
}; 

const {v4} = require('uuid')
const uuidv4 = v4

const seed = async () => {
  const SQL = `
  
  `
}
