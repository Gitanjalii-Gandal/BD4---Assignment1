const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware to parse JSON
app.use(express.json());



// Exercise 1: Get All Restaurants
app.get('/restaurants', (req, res) => {
  db.all('SELECT * FROM restaurants', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ restaurants: rows });
    }
  });
});

// Exercise 2: Get Restaurant by ID
app.get('/restaurants/details/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM restaurants WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ restaurant: row });
    }
  });
});

// Exercise 3: Get Restaurants by Cuisine
app.get('/restaurants/cuisine/:cuisine', (req, res) => {
  const { cuisine } = req.params;
  db.all(
    'SELECT * FROM restaurants WHERE cuisine = ?',
    [cuisine],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ restaurants: rows });
      }
    }
  );
});

// Exercise 4: Get Restaurants by Filter
app.get('/restaurants/filter', (req, res) => {
  const { isVeg, hasOutdoorSeating, isLuxury } = req.query;
  const conditions = [];
  const values = [];

  if (isVeg) {
    conditions.push('isVeg = ?');
    values.push(isVeg);
  }
  if (hasOutdoorSeating) {
    conditions.push('hasOutdoorSeating = ?');
    values.push(hasOutdoorSeating);
  }
  if (isLuxury) {
    conditions.push('isLuxury = ?');
    values.push(isLuxury);
  }

  const query = `SELECT * FROM restaurants ${
    conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''
  }`;

  db.all(query, values, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ restaurants: rows });
    }
  });
});

// Exercise 5: Get Restaurants Sorted by Rating
app.get('/restaurants/sort-by-rating', (req, res) => {
  db.all('SELECT * FROM restaurants ORDER BY rating DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ restaurants: rows });
    }
  });
});



// Exercise 6: Get All Dishes
app.get('/dishes', (req, res) => {
  db.all('SELECT * FROM dishes', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ dishes: rows });
    }
  });
});

// Exercise 7: Get Dish by ID
app.get('/dishes/details/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM dishes WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ dish: row });
    }
  });
});

// Exercise 8: Get Dishes by Filter
app.get('/dishes/filter', (req, res) => {
  const { isVeg } = req.query;
  const query = isVeg
    ? 'SELECT * FROM dishes WHERE isVeg = ?'
    : 'SELECT * FROM dishes';
  const params = isVeg ? [isVeg] : [];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ dishes: rows });
    }
  });
});

// Exercise 9: Get Dishes Sorted by Price
app.get('/dishes/sort-by-price', (req, res) => {
  db.all('SELECT * FROM dishes ORDER BY price ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ dishes: rows });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
