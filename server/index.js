
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite')

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Budgets table
  db.run(`CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    period TEXT DEFAULT 'monthly',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Goals table
  db.run(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    target_date TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)
})

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into database
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' })
          }
          return res.status(500).json({ error: 'Database error' })
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: this.lastID, username, email },
          JWT_SECRET,
          { expiresIn: '24h' }
        )

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: { id: this.lastID, username, email }
        })
      }
    )
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      })
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Transaction Routes
app.get('/api/transactions', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      res.json(rows)
    }
  )
})

app.post('/api/transactions', authenticateToken, (req, res) => {
  const { type, amount, category, description, date } = req.body

  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: 'Required fields missing' })
  }

  db.run(
    'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, type, amount, category, description, date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      
      res.status(201).json({
        id: this.lastID,
        user_id: req.user.id,
        type,
        amount,
        category,
        description,
        date
      })
    }
  )
})

app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params

  db.run(
    'DELETE FROM transactions WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Transaction not found' })
      }
      
      res.json({ message: 'Transaction deleted successfully' })
    }
  )
})

// Budget Routes
app.get('/api/budgets', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM budgets WHERE user_id = ?',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      res.json(rows)
    }
  )
})

app.post('/api/budgets', authenticateToken, (req, res) => {
  const { category, amount, period } = req.body

  if (!category || !amount) {
    return res.status(400).json({ error: 'Category and amount are required' })
  }

  db.run(
    'INSERT INTO budgets (user_id, category, amount, period) VALUES (?, ?, ?, ?)',
    [req.user.id, category, amount, period || 'monthly'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      
      res.status(201).json({
        id: this.lastID,
        user_id: req.user.id,
        category,
        amount,
        period: period || 'monthly'
      })
    }
  )
})

// Goals Routes
app.get('/api/goals', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM goals WHERE user_id = ?',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      res.json(rows)
    }
  )
})

app.post('/api/goals', authenticateToken, (req, res) => {
  const { title, target_amount, current_amount, target_date, description } = req.body

  if (!title || !target_amount) {
    return res.status(400).json({ error: 'Title and target amount are required' })
  }

  db.run(
    'INSERT INTO goals (user_id, title, target_amount, current_amount, target_date, description) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, title, target_amount, current_amount || 0, target_date, description],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      
      res.status(201).json({
        id: this.lastID,
        user_id: req.user.id,
        title,
        target_amount,
        current_amount: current_amount || 0,
        target_date,
        description
      })
    }
  )
})

// Dashboard data
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  
  db.all(
    `SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
      category,
      type,
      SUM(amount) as category_total
    FROM transactions 
    WHERE user_id = ? AND date LIKE ?
    GROUP BY category, type`,
    [req.user.id, `${currentMonth}%`],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }

      const summary = {
        total_income: 0,
        total_expenses: 0,
        category_spending: {}
      }

      rows.forEach(row => {
        if (row.type === 'income') {
          summary.total_income += row.category_total
        } else {
          summary.total_expenses += row.category_total
          summary.category_spending[row.category] = row.category_total
        }
      })

      summary.net_income = summary.total_income - summary.total_expenses

      res.json(summary)
    }
  )
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
