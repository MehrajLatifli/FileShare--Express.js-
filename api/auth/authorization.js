import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const {TOKEN_SECRET,PASSWORD_SECRET} =process.env


export function createHashPassword(password)
{
   return jwt.sign(password,PASSWORD_SECRET)
}





export function comparePassword(password, hashed)
{
   const unhashed = jwt.verify(hashed,PASSWORD_SECRET)

   if(unhashed==password)
   {

    return true

   }

   return false
}


export function createToken(user)
{
   const expiresIn = '5h'; 

   return jwt.sign(user, TOKEN_SECRET, {expiresIn})

   // const payload = {
   //    id: user.id,
   //    username: user.username,
   //    email: user.email,
   //  };
  
   //  const token = jwt.sign(payload, process.env.TOKEN_SECRET);
   //  return token;
} 

export function verifyToken(token){
    return jwt.verify(token, TOKEN_SECRET)
}


