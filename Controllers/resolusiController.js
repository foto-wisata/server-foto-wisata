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
                return res.status(201).json({
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
        let {id} = req.params
        console.log(id);
        
        try {
            let filter
            if (id) {
                filter = {user:id}
            } else {
                filter = {}
            }
            let resolusi = await Resolusi.find(filter).exec()
            res.json(resolusi)
        } catch (err) {
            next({code: 500, msg: err.message})
        }
    }

    static async edit(req, res, next) {
        let {id} = req.params
        let {description, image} = req.body

        try {
            let resolusi = await Resolusi.findOne({_id: id}).exec()
            if (description) resolusi.description = description
            if (image) resolusi.image = image
            await resolusi.save()
            res.json({id})
        } catch (err) {
            next(err)
        }
    }

    static async delete(req, res, next) {
        let {id} = req.params
        
        try {
            await Resolusi.deleteOne({_id:id}).exec()
            res.json({id})
        } catch (err) {
            next(err)
        }
    }
}

module.exports = ResolusiController