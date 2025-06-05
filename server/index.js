const express = require("express");
const app = express();
const {
  seed,
  client,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation
} = require('./db');

app.use(express.json());

// API Routes
app.get('/api/customers', async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});

app.get('/api/restaurants', async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error);
  }
});

app.get('/api/reservations', async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    next(error);
  }
});

app.post('/api/customers/:id/reservations', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { restaurant_id, date, party_count } = req.body;
    
    const reservation = await createReservation({
      customer_id: id,
      restaurant_id,
      date,
      party_count
    });
    
    res.status(201).send(reservation);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/reservations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await destroyReservation(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  await client.connect()
  await seed()

  const PORT = 3000
  app.listen(PORT, () => {
      console.log(`connected to port ${PORT}`)
  })
}

init()