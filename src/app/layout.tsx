import "../index.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Shabeena Studio | Custom Apparel", description: "Custom printed apparel and premium streetwear" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return (
<html lang="en">
    <head>
        <link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>
    </head>
    <body>{children}</body>
</html>
) }
