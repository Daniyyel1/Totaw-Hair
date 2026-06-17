import mongoose from "mongoose"


export const dbConnect = async()=>{
   try{
     const conn = await mongoose.connect(String(process.env.MONGO_DB_CONN_STRING))
    return conn;
   }catch(e){
     console.error(e)
   }
}