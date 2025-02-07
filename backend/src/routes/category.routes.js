const router = require('express').Router();
const { upload } = require('../config/multer');
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
} = require('../controllers/category.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', [authMiddleware, isAdmin], createCategory);
router.put('/:id', [authMiddleware, isAdmin], updateCategory);
router.delete('/:id', [authMiddleware, isAdmin], deleteCategory);
module.exports = router;
