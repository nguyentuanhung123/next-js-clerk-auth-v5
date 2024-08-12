"use server";

import User from "@/models/user.model";
import { connect } from "@/db";

export async function createUser(user: any) {
    await connect();
    try {
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch(error) {
        console.log(error);
    }
}