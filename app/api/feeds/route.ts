import { dbConnect } from "@/app/lib/mongo";
import feedsModel from "@/app/model/feeds-model";
import { NextResponse } from "next/server";

interface RequestBody {
    email:string;
}


export const POST = async(request: Request)=>{ 

    const { email } = await request.json() as RequestBody;

       await dbConnect();
     try{
        const sendFeedBack = await feedsModel.insertOne({email});

        if(!sendFeedBack){
            return NextResponse.json({success:false}, {status:401});
        }

        return NextResponse.json({success:true, data:sendFeedBack}, {status:201})
     }catch (e) {
         const message = e instanceof Error ? e.message : "Internal Server Error";
         return new NextResponse(message, {
           status: 500,
         });
       }

}