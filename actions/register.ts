"use server"
import { connectDB } from "../src/lib/mongoose";
import WalkUser from "@/app/models/usermodel";
import bcrypt from "bcryptjs";


export const register = async (values: any) => {
    const { email, password, name } = values;
    try {
        await connectDB();
        const userFound = await WalkUser.findOne({ email });
        if(userFound){
            return {
                error: 'Email already exists!'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new WalkUser({
          name,
          email,
          password: hashedPassword,
        });
        const savedUser = await user.save();
    }catch(e){
        console.log(e);
    }
}