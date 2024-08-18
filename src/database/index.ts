import mongoose from "mongoose";

const connectToDB = async () => {
    const connectionUrl = process.env.MONGODB_URL!;

    mongoose 
        .connect(connectionUrl)
        .then(() => console.log('Auth database connected successfully.'))
        .catch((e) => console.log(e))
}

export default connectToDB;