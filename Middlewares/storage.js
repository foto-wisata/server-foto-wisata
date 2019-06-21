const gcsHelpers = require('../Helpers/storageHelper');

const { storage } = gcsHelpers;

/**
 * Middleware for uploading file to GCS.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */
exports.sendUploadToGCS = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const bucketName = 'resolutionmaker.khariskhasburrahman.com';
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(gcsFileName);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    stream.on('error', (err) => {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsFileName;

        return file.makePublic()
            .then(() => {
                req.file.gcsUrl = gcsHelpers.getPublicUrl(bucketName, gcsFileName);
                next();
            });
    });

    stream.end(req.file.buffer);
};