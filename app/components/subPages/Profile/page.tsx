
import { auth } from "@/app/auth";
import { dbConnect } from "@/app/lib/mongo";
import usersModel from "@/app/model/users-model";
import { redirect } from "next/navigation";
import React from "react";
import ProfileContext from "./ProfileContext";

const ProfilePage = async () => {
  const session = await auth();

    if (!session?.user) redirect("/Login");

    

     await dbConnect();

  const user = await usersModel.findById(session.user.id).lean();
  console.log(user);

  return (
    <section>
     
     <ProfileContext userName={user?.name} email={user?.email} userPicture={user?.profilePicture} phoneNo={user?.telephone} userBio={user?.bio} />
      
    </section>
  );
};

export default ProfilePage;
