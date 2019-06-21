const express = require('express')
const router = express.Router()
const resolusiController = require('../controllers/resolusiController')
const _multer = require('multer')
const gcsMiddlewares = require('../Middlewares/storage')
const authMiddleware = require('../Middlewares/auth')
const multer = _multer({
    storage: _multer.MemoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
    },
});

router.post('/', 
    authMiddleware.Authentication,
    multer.single('image'), 
    gcsMiddlewares.sendUploadToGCS, 
    resolusiController.create)
router.patch('/:id', authMiddleware.Authentication, 
                    authMiddleware.Authorization, 
                    resolusiController.edit)
router.delete('/:id', authMiddleware.Authentication, 
                    authMiddleware.Authorization, 
                    resolusiController.delete)

router.get('/', resolusiController.get)
router.get('/:id', resolusiController.get)



module.exports = router