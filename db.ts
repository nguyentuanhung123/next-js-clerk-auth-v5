import mongoose, { Mongoose } from 'mongoose';

/**
 * Dấu ! được gọi là Non-null Assertion Operator trong TypeScript. 
 * Nó cho TypeScript biết rằng bạn chắc chắn rằng giá trị của process.env.MONGODB_URL không phải là null hoặc undefined.
 */
const MONGODB_URL = process.env.MONGODB_URL!;

/**
 * conn: Mongoose | null;
 * conn có thể là một đối tượng kiểu Mongoose hoặc null.
 * Đây thường là đối tượng kết nối Mongoose thực sự, hoặc null nếu kết nối chưa được thiết lập hoặc đã bị hủy.
 * 
 * promise: Promise<Mongoose> | null;
 * promise có thể là một Promise đại diện cho kết nối Mongoose đang được thiết lập, hoặc null nếu không có promise nào đang được chờ xử lý.
 * Khi bạn thiết lập kết nối Mongoose, bạn thường có một promise trả về từ mongoose.connect(), và thuộc tính này có thể dùng để theo dõi trạng thái kết nối.
 */
interface MongooseConn {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose;

if(!cached) {
    cached = (global as any).mongoose = { 
        conn: null, 
        promise: null 
    };
}

export const connect = async () => {
    if(cached.conn) return cached.conn;

    cached.promise =
    cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: "clerkauthv5",
        bufferCommands: false,
        connectTimeoutMS: 30000
    });

    cached.conn = await cached.promise;

    return cached.conn;
}