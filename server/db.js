const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner')


const {v4} = require('uuid')
const uuidv4 = v4

const createCustomer = async ({name}) => {
  const sql = `
  INSERT INTO customers (id, name)
  VALUES ($1, $2)
  RETURNING *
  `
  const result = await client.query(sql, [uuidv4(), name])
  return result.rows[0]
}

const createRestaurant = async ({name}) => {
  const sql = `
  INSERT INTO restaurants (id, name)
  VALUES ($1, $2)
  RETURNING *
  `
  const result = await client.query(sql, [uuidv4(), name])
  return result.rows[0]
}

const createReservation = async ({date, party_count, customer_id, restaurant_id}) => {
  const sql = `
  INSERT INTO reservations (id, date, party_count, customer_id, restaurant_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
  `
  const result = await client.query(sql, [uuidv4(), date, party_count, customer_id, restaurant_id])
  return result.rows[0]
}

const fetchCustomers = async () => {
  const sql = `
    SELECT * FROM customers
  `;
  const result = await client.query(sql);
  return result.rows;
};

const fetchRestaurants = async () => {
  const sql = `
    SELECT * FROM restaurants
  `;
  const result = await client.query(sql);
  return result.rows;
};

const fetchReservations = async () => {
  const sql = `
    SELECT * FROM reservations
  `;
  const result = await client.query(sql);
  return result.rows;
};

const destroyReservation = async (id) => {
  const sql = `
    DELETE FROM reservations
    WHERE id = $1
  `;
  await client.query(sql, [id]);
}








const seed = async () => {
  const sql = `
  DROP TABLE IF EXISTS reservations;
  DROP TABLE IF EXISTS restaurants;
  DROP TABLE IF EXISTS customers;
  CREATE TABLE customers (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  );
  CREATE TABLE restaurants (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  );
  CREATE TABLE reservations (
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    party_count INT NOT NULL,
    customer_id UUID REFERENCES customers(id) NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) NOT NULL
  );
  `
  await client.query(sql)
  const [dan, may, daniel, hannah, jeff] = await Promise.all([
    createCustomer({name: 'dan'}),
    createCustomer({name: 'may'}),
    createCustomer({name: 'daniel'}),
    createCustomer({name: 'hannah'}),
    createCustomer({name: 'jeff'}),
  ])
  const [inNOut, TacoBell, ChickFilA] = await Promise.all([
    createRestaurant({name: 'inNOut'}),
    createRestaurant({name: 'TacoBell'}),
    createRestaurant({name: 'ChickFilA'}),
  ])
  await Promise.all([
    createReservation({ 
      date: '2024-01-01',
      party_count: 2,
      customer_id: dan.id,
      restaurant_id: inNOut.id,
    }),
    createReservation({
      date: '2024-01-01',
      party_count: 3,
      customer_id: may.id,
      restaurant_id: TacoBell.id,
    }),
    createReservation({
      date: '2024-01-01',
      party_count: 4,
      customer_id: daniel.id,
      restaurant_id: ChickFilA.id,
    }),
    createReservation({
      date: '2024-01-01',
      party_count: 5,
      customer_id: hannah.id,
      restaurant_id: inNOut.id,
    }),
    createReservation({
      date: '2024-01-01',
      party_count: 6,
      customer_id: jeff.id,
      restaurant_id: ChickFilA.id,
    }),

    
  ])
  console.log('created tables and seeded data')

}
module.exports = {
  client,
  seed,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation
}