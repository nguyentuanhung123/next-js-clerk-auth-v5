"use server";

import User from "@/models/user.model";
import { connect } from "@/db";
// import connectToDB from "@/database";

export async function createUser(user: any) {
    await connect();
    // await connectToDB();
    try {
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch(error) {
        console.log(error);
    }
}