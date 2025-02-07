const router = require('express').Router();
const { upload } = require('../config/multer');
const {
    getAllContent,
    createContent,
    updateContent,
    deleteContent,
    getContentById
} = require('../controllers/content.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.get('/', getAllContent);
router.get('/:id', getContentById);
router.post('/', [authMiddleware, isAdmin], createContent);
router.put('/:id', [authMiddleware, isAdmin], updateContent);
router.delete('/:id', [authMiddleware, isAdmin], deleteContent);

module.exports = router;
