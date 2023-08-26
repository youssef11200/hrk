const {check, validationResult} = require('express-validator')

exports.postValidator=[
    check('name').trim().not().isEmpty().withMessage('name is missing'),
    check('quantity').trim().not().isEmpty().withMessage(' quantity is missing'),
    check('description').trim().not().isEmpty().withMessage('description is missing'),
   
    ]
   

    exports.validate = (res,req,next)=>{
        const error = validationResult(req).array()
        if(error.lenght){
           res.status(401).json({error:error[0].msg})
        }
        
next()
    }