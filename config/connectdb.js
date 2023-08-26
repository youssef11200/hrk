const mongoose = require('mongoose')
 const connectdb = async()=>{
    
            const connection= {
                
                    useUnifiedTopology:true,
                    useNewUrlParser:true
                
            }
        try{
            await mongoose.connect(process.env.mongourl,connection)
       console.log('database connected') }
    catch (error){
        console.log(error)
    }}
   module.exports = connectdb
     