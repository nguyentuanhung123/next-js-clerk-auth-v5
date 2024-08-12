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

/**
 * 2. Lưu trữ và kiểm tra kết nối đã được lưu trữ trong global:
 * cached là một biến lưu trữ kết nối Mongoose từ đối tượng global. Nếu 
 * global.mongoose không tồn tại (hoặc cached là null), 
 * thì khởi tạo một đối tượng mới với conn và promise đều là null. 
 * Việc sử dụng global giúp đảm bảo rằng chỉ có một kết nối Mongoose duy nhất được tạo ra trong toàn bộ ứng dụng.
 */
let cached: MongooseConn = (global as any).mongoose;

if(!cached) {
    cached = (global as any).mongoose = { 
        conn: null, 
        promise: null 
    };
}

/**
 * 
 * 3. Hàm connect:
 * Hàm connect là một hàm bất đồng bộ (async) dùng để kết nối đến MongoDB.
 * Nếu cached.conn đã tồn tại (đã kết nối), thì trả về kết nối hiện tại (cached.conn).
 * Nếu cached.conn chưa tồn tại, hàm kiểm tra xem cached.promise có tồn tại không. 
 * Nếu không, nó sẽ tạo một Promise kết nối đến MongoDB bằng mongoose.connect. Tham số cấu hình bao gồm:
 * dbName: Tên cơ sở dữ liệu MongoDB.
 * bufferCommands: Nếu false, các lệnh sẽ không được lưu trữ nếu không có kết nối.
 * connectTimeoutMS: Thời gian tối đa (30 giây) để chờ kết nối.
 * cached.promise lưu Promise của kết nối, và cached.conn lưu kết quả kết nối sau khi Promise hoàn thành.
 * Cuối cùng, trả về kết nối Mongoose đã được thiết lập (cached.conn).
 * 
 * Mục đích
 * Quản lý kết nối: Đảm bảo chỉ có một kết nối duy nhất đến MongoDB trong toàn bộ ứng dụng, tránh việc tạo nhiều kết nối không cần thiết.
 * Tối ưu hóa hiệu suất: Sử dụng Promise để chờ kết nối và lưu trữ kết nối để sử dụng lại sau này, giúp tiết kiệm thời gian khởi tạo kết nối.
 */
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