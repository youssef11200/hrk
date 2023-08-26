const bcrypt = require('bcryptjs')
const users =[
    {
name:"Admin",
email:"jonh123@gmail.com",
password:bcrypt.hashSync("123456",10),
isAdmin:true
},
{

    name:"farmer",
    email:"jane123@gmail.com",
    password:bcrypt.hashSync("123456",10),
    isAdmin:false
},
{
    name:"buyer",
email:"fred123@gmail.com",
password:bcrypt.hashSync("123456",10),
isAdmin:false

}]

module.exports= users