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