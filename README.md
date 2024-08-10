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

