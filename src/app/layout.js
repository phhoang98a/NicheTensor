import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NicheImage",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <div className="h-screen flex flex-col">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>

      </body>
    </html>
  );
}
