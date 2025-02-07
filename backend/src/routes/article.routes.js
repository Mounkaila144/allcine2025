const router = require('express').Router();
const { upload } = require('../config/multer');
const {
    getAllArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticleById
} = require('../controllers/article.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.post('/', [
    authMiddleware,
    isAdmin,
    upload.single('image'),  // Multer gèrera le parsing du body
    createArticle
]);

router.put('/:id', [
    authMiddleware,
    isAdmin,
    upload.single('image'),  // Multer gèrera le parsing du body
    updateArticle
]);
router.delete('/:id', [authMiddleware, isAdmin], deleteArticle);

module.exports = router;