const Resolusi = require('../Models/resolusiModel')

class ResolusiController {
    static async create(req, res, next) {
        let { description } = req.body
        let {id} = req.decode
        if (req.file && req.file.gcsUrl) {
            try {
                let resolusi = await Resolusi.create({
                    description,
                    image: req.file.gcsUrl,
                    user: id
                })
                return res.json({
                    id: resolusi._id,
                    description,
                    url: req.file.gcsUrl
                });
            } catch (err) {
                next({code: 500, msg: err.message})
            }
        }
        next({code:500, msg:'Unable to upload'});
    }
    static async get(req, res, next) {
        try {
            let resolusi = await Resolusi.find().exec()
            res.json(resolusi)
        } catch (err) {
            next({code: 500, msg: err.message})
        }
    }
}

module.exports = ResolusiController