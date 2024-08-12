This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## file .env

```jsx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
MONGODB_URL=
WEBHOOK_SECRET=
```

## Giải thích về đoạn code

```jsx
<div className="flex items-center justify-center h-full">
    <div className="text-2xl">Home Page</div>
</div>
```

- Dù ta để h-full nhưng thẻ div này ở Home page chỉ có chiều cao phụ thuộc vào nội dung bên trong nó

- Sau khi xóa các nút SignIn và User Profile của Clerk, ta có:

```jsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col h-screen">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

- Sau khi sửa lại ở file layout.tsx thì thẻ div với class h-full ở Home page mới có tác dụng

- Bổ sung Clerk Loading và Clerk Loaded

```jsx
import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading
} from '@clerk/nextjs'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClerkLoading>
            <div className="flex items-center justify-center h-screen text-2xl">
              LOADING...
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col h-screen">
                {children}
              </div>
            </div>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

- Sau khi thêm như trên thì khi refresh LOADING sẽ được hiện lên và khoảng 1s sau Home page mới được hiện và nếu ta để thẻ Link và chuyển trang thì Loading cũng sẽ được hiện, nếu không có thì hiện 404

## Read-sesion-data: https://clerk.com/docs/references/nextjs/read-session-data

- Lưu ý Fragment cũng đóng vai trò bao bọc nhưng nó không triệt để như thẻ div nên nếu thẻ div để flex mà bên trong nó có Fragment và Fragment có 2 thẻ Link thì nó không nhìn Fragment mà để flex tác dụng đến 2 thằng thẻ Link bên trong

- B1: Bổ sung auth() trong Navbar.tsx

```tsx
const { userId } = auth();

<div className="flex gap-6 items-center">
    {
        !userId ? (
            <>
                <Link href="/sign-in">
                    <li>Login</li>
                </Link>
                <Link href="/sign-up">
                    <li>Sign up</li>
                </Link>
            </>
        ) : (
            <>
                <Link href="/profile">
                    <li>Profile</li>
                </Link>
                <li className="flex items-center">
                    <UserButton />
                </li>
            </>
        )
    }
</div>
```

- Sửa lại Login page

```jsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <SignIn />
    </div>
  )
}
```

- Lưu ý: Một số người dùng không muốn bấm vào nut login để chuyển sang Login page mà muốn gõ trên thanh URL để chuyển thì ta phải kiểm tra xem người dùng đã đăng xuất chưa, nếu đã đăng xuất thì người dùng gõ xong mới chuyển trang được

- Sửa lại

```tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <SignIn afterSignOutUrl="/" />
    </div>
  )
}
```

- Tức là sau khi người dùng đăng xuất thì nó sẽ chuyển sang home page, nếu đã đăng nhập mà gõ đường dẫn sign-in thì nó sẽ chuyển hướng sang home page

## Việc thêm ClerkLoaded và ClerkLoading rất quan trong vì nếu ta không đặt chúng và project sẽ có vài vấn đề xảy ra như khi ta refresh thì SignUp sẽ nhấp nháy và sẽ hiện mấy cái như Login và sau khoảng vài nghìn mili giây thì nó mới hiện mấy cái như Profile Link do trong thời gian loaded lại nó không biết người dùng đã đăng nhập hay chưa. Việc thêm ClerkLoaded và ClerkLoading giúp ta khi refresh thì sau khi đăng nhập sẽ hiện luôn Navbar có Profile và User button

# Ta muốn chỉnh lại màu sắc cho các thành phần trong Clerk như modal được hiện

- B1: npm i @clerk/themes
- B2: Những thứ được tích hợp clerk sẽ được chuyển sang màu tối

```tsx
import {dark} from "@clerk/themes"

<ClerkProvider appearance={{ baseTheme: dark }}>...</ClerkProvider>
```

# Tạo thêm Profile page

```tsx
import { UserProfile } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Profile = async () => {

    const { userId } = auth();
    const isAuth = !!userId;
    const user = await currentUser();

    if(!isAuth) {
        redirect('/')
    }    

    return (
       <div className="flex flex-col items-center justify-center mt-8">
            <h1>{user?.username}</h1>
            <UserProfile />
       </div>
    )
}

export default Profile
```

- Lúc này ở Clerk đang hiện user đang đăng nhập và sử dụng trang web này (Xem ở Dashboard của Clerk)

- Chuyển đổi route từ Server-side, đây là cách bảo vệ route này để nó không bị nhấp nháy trang vì điều này xảy ra ở Server side

## Xóa người dùng đang đăng nhập trên website bằng Clerk 
- B1: Nhấn vào dấu 3 chấm bên phải của user đang đăng nhập
- B2: Bấm Delete user (Sau khi xóa user ở Clerk thì user đang đăng nhập sẽ bị đăng xuất)

## Thiết lập khi đăng nhập bằng github (google) bằng email mới toanh thì sẽ người dùng phải gõ thêm username để thiết lập cho user đó
- B1: Ở Sidebar, nhấn User & Authentication để hiện submenu
- B2: Chọn mục Email, Phone, Username 
- B3: Enabel ở mục Username
- B4: Nhấn Save ở cuối màn hình

## Lưu ý: Ở Social Connection thì khi ta enable một mạng xã hội như google thì ở website ta sẽ phải refresh lại browser thì nút đăng nhập bằng google sẽ biến mất

## Sử dụng middleware của Clerk để bảo vệ route của client page
- Vấn đề : Khi chưa đăng nhập mà ta vào client page (http://localhost:3000/client) thì sẽ không hiện gì

## clerkMiddleware()

- Trình trợ giúp ClerkMiddleware() tích hợp xác thực Clerk vào ứng dụng Next.js của bạn thông qua Middleware. ClerkMiddleware() tương thích với cả App và Pages routers.

## createRouteMatcher()
- createRouteMatcher() là một hàm trợ giúp Clerk cho phép bạn bảo vệ nhiều route. createRouteMatcher() chấp nhận một loạt các route và kiểm tra xem route mà người dùng đang cố truy cập có khớp với một trong các route được truyền cho nó hay không. Các đường dẫn được cung cấp cho trình trợ giúp này có thể có cùng định dạng với các đường dẫn được cung cấp cho trình so khớp Middleware Tiếp theo.

- Trình trợ giúp createRouteMatcher() trả về một hàm mà nếu được gọi với đối tượng req từ Middleware, hàm này sẽ trả về true nếu người dùng đang cố truy cập vào một tuyến đường khớp với một trong các tuyến đường được truyền tới createRouteMatcher().

- Trong ví dụ sau, createRouteMatcher() đặt tất cả các tuyến /dashboard và /forum làm các tuyến được bảo vệ.

```ts
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
]);
```

## Protect routes based on user authentication status (Bảo vệ các tuyến đường dựa trên trạng thái xác thực người dùng)

- Bạn có thể bảo vệ các route dựa trên trạng thái xác thực người dùng bằng cách kiểm tra xem người dùng đã đăng nhập hay chưa.
- Có hai phương pháp mà bạn có thể sử dụng:

+ Sử dụng auth().protect() nếu bạn muốn tự động chuyển hướng người dùng chưa được xác thực đến tuyến đăng nhập.
+ Sử dụng auth().userId nếu bạn muốn kiểm soát nhiều hơn những gì ứng dụng của bạn thực hiện dựa trên trạng thái xác thực người dùng.

## Các bước chỉnh sửa middleware

- B1: Sửa lại file middleware.ts

- Ban đầu
```ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

- Sau khi sửa

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Bảo về route client do nó là client component
 * Những cái khác đã được bảo vệ theo cách khác
 */
const isProtectedRoute = createRouteMatcher([
  '/client'
])

/**
 * Nếu người dùng chưa đăng nhập mà bấm nút để chuyển sang client page
 * thì sẽ tự động chuyển hướng sang SignIn page
 */
export default clerkMiddleware((auth, req) => {
  if(isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

## GET user data on API

- B1: Tạo folder api và folder data bên trong nó
- B2: Tạo file route.ts trong folder data

```ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = auth();
    const user = await currentUser();

    return NextResponse.json(
        {
            message: 'Authenticated',
            data: {
                userId: userId,
                username: user?.username
            }
        },
        {
            status: 200
        }
    )
}
```

- B3: Sử dụng đường dẫn http://localhost:3000/api/data để xem data trả về dưới dạng JSON

- Nếu người dùng đã đăng nhập

```json
{
  "message": "Authenticated",
  "data": {
    "userId": "user_.......",
    "username": "li....."
  }
}
```

- Nếu người dùng chưa đăng nhập

```json
{
  "message": "Authenticated",
  "data": {
    "userId": null,
  }
}
```

- B4: Không được phép hiện như trên và phải bổ sung đoạn code bên dưới

```ts
if (!userId) {
    return NextResponse.json(
        {message: 'Not Authenticated'},{ status: 401 }
    )
}
```

## Client page và Profile page đều là các trang hiện thông tin cá nhân chỉ khác 1 cái là client component và 1 cái là server component

## Kết nối mongodb và nếu người dùng tạo mới 1 user bằng clerk thì cũng sẽ được lưu trữ trong mongodb

- npm i mongodb mongoose svix

- Svix là một dịch vụ cung cấp giải pháp webhook cho các nhà phát triển. Webhooks là cơ chế cho phép ứng dụng gửi dữ liệu tới các dịch vụ khác khi có sự kiện xảy ra, và Svix giúp đơn giản hóa việc quản lý và bảo mật các webhook này.

## Các bước cấu hình
- B1: Tạo folder models bên trong thư mục gốc và file user.model.ts bên trong nó

```ts
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,  
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    }
})

const User = models?.User || model('User', UserSchema);

export default User;
```

- B2: Bổ sung MONGODB_URL ở file .env.local : 

- B3: Tạo file db.ts trong thư mục gốc

```ts
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL!;

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
```

- B4: Vào trang chủ của Clerk, ở sidebar Settings, ta enable Remove "Secured by Clerk" ... (Nếu muốn)

- B5: Vào link https://clerk.com/docs/integrations/webhooks/sync-data (Webhook là một cơ chế cho phép một ứng dụng gửi dữ liệu đến một ứng dụng khác khi một sự kiện cụ thể xảy ra. Đây là một cách để các dịch vụ có thể "giao tiếp" với nhau mà không cần phải thường xuyên kiểm tra trạng thái của nhau (polling).) để xem thông tin

- B6: Vào lại trang chủ của Clerk, ở sidebar chọn Webhooks,

- B7: Chọn Add Endpoint, tích user created bên dưới (thêm user deleted và user updated nếu muốn)

- B8: Tạo folder webhooks trong folder api

- B9: Tạo folder clerk trong folder webhooks

- B10: Ở Endpoint URl, bổ sung http://abcd.com/api/webhooks/cleck và bấm Create (Sẽ phải thay đổi url khi project được đẩy lên vercel)

- B11: Copy Signing Secret được tạo

- B12: Copy và paste đoạn code vào file route.ts đã tạo trong folder cleck

```ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;

  // Bổ sung đoạn này
  if(eventType === "user.created") {
    const {id, email_addresses, image_url, first_name, last_name, username} = evt.data

    const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username!,
        photo: image_url!,
        first_name: first_name,
        last_name: last_name
    }

    console.log(user);
    
  }
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  return new Response('', { status: 200 })
}
```

- B13: Bổ sung WEBHOOK_SECRET trong file .env.local và Paste Signing Secret đã copy trước đó vào đây

- B14: Tạo folder actions trong thư mục gốc và file user.action.ts bên trong nó

```ts
"use server";

import User from "../models/user.model";
import { connect } from "../db";

export async function createUser(user: any) {
    try {
        await connect();
        const newUser = new User(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch(error) {
        console.log(error);
    }
}
```

- B15: Bổ sung thêm bên trong file route.ts đã tạo trong folder cleck

```ts
// Bổ sung đoạn dưới để kết nối mongodb
const newUser = await createUser(user);

if(newUser) {
    await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
            userId: newUser._id
        }
    })
}

return NextResponse.json({
    mesage: "New user created",
    user: newUser
});
```

- B16: Vào MongoDB, ở Sidebar chọn Network Access và bấm nút ADD IP ADDRESS

- B17: Bấm nút Allow access anywhere ... đang được hiện

## Lưu ý: Nếu ta xóa tài khoản user trong clerk và user đó đang đăng nhập thì có khả năng sẽ bị lỗi do bị chuyển hướng quá nhiều lần : Khắc phục bằng cách xóa hết cookies

## Đẩy Project lên Vercel

- B1: Vào vercel
- B2: Import project
- B3: Setup enviroment bằng cách paste các biến đã set trong file .env.local
- B4: Bấm Deploy
- B5: Vào Webhook của Clerk, ta phải thay url abcd.com ban đầu bằng 1 url thực tế (Xem ở B9)
- B6: Vào Contine Dashboard của Vercel, bấm vào domain (Nếu nó hiện project là thành công)
- B7: Copy đường link đang hiện trên tab
- B8: Thay thế Endpoint (trong Dashboard Clerk) như đã nói ở B5, bấm Edit để sừa lại đường dẫn

- Ban đầu

```html
http://abcd.com/api/webhooks/cleck
```

- Sau khi sửa

```html
https://next-js-clerk-auth-v5.vercel.app/api/webhooks/cleck
```

- B9: Bấm Save
- B10: Xóa toàn bộ user ở clerk đã làm trước đó để kiểm tra tính đồng bộ

## Lưu ý: Tên của database không nhất thiết phải trùng với tên project
- Database ta đã đặt là: clerkauthv5 (xem trong db.ts)






