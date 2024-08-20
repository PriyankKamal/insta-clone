// const { parseAsync } = require("../validators/auth-validator")

const validateScheam =(schema)=>async(req,res,next)=>{
    try {
        const parseBody = await schema.parseAsync(req.body)
        req.body = parseBody
        next()
    } catch (error) {
        console.log(error.issues)

        res.status(400).json(error.issues)
    }
}

module.exports = validateScheam