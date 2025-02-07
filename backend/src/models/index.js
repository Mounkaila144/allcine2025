const sequelize = require('../config/database');
const User = require('./User');
const Content = require('./Content');
const Like = require('./Like');
const Article = require('./Articles');
const Loyalty = require('./Loyalty');
const Order = require('./Order');
const Category = require('./Category');

// Définir les relations
User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });

Content.hasMany(Like, { foreignKey: 'content_id' });
Like.belongsTo(Content, { foreignKey: 'content_id' });

User.hasOne(Loyalty, { foreignKey: 'user_id' });
Loyalty.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Relation Article et Category
Category.hasMany(Article, { foreignKey: 'categorie_id' });
Article.belongsTo(Category, { foreignKey: 'categorie_id' });

module.exports = {
    sequelize,
    User,
    Content,
    Like,
    Article,
    Loyalty,
    Order,
    Category
};