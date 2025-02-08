const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving for uploads
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/categories', require('./src/routes/category.routes'));
app.use('/api/orders', require('./src/routes/order.routes'));
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/articles', require('./src/routes/article.routes'));
app.use('/api/contents', require('./src/routes/content.routes'));
app.use('/api/likes', require('./src/routes/like.routes'));
app.use('/api/loyalty', require('./src/routes/loyalty.routes'));
app.use('/api/dashboard', require('./src/routes/dashboard.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Une erreur est survenue!',
        error: err.message
    });
});

// Server startup
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
}).catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
});