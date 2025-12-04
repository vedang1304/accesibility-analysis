const validator=require("validator");

const validate = (data)=>{
    const reqfield=['firstName','emailId','password'];
    const isallowed=reqfield.every((k)=> Object.keys(data).includes(k));

     if(!isallowed)
        throw new Error("Some Field Missing");

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Week Password");

}

/*const validateurl1 = (url)=>{
    if (!url || !/^https?:\/\/.+$/.test(url)) {
       return res.status(400).json({ error: 'A valid URL is required.' });
  }

}
  */
module.exports=validate