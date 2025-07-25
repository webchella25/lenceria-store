import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Lencería Store - Lencería Íntima Premium | Entrega 24h",
    template: "%s | Lencería Store"
  },
  description: "Descubre nuestra exclusiva colección de lencería íntima premium. Entrega en 24h, packaging discreto y los mejores precios. ¡Envío gratis desde 50€!",
  keywords: ["lencería", "lencería íntima", "ropa interior", "lencería sexy", "lencería erótica", "España"],
  authors: [{ name: "Lencería Store" }],
  creator: "Lencería Store",
  publisher: "Lencería Store",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://lenceriastore.es",
    siteName: "Lencería Store",
    title: "Lencería Store - Lencería Íntima Premium",
    description: "Descubre nuestra exclusiva colección de lencería íntima premium. Entrega en 24h y packaging discreto.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lencería Store - Lencería Íntima Premium",
    description: "Descubre nuestra exclusiva colección de lencería íntima premium. Entrega en 24h y packaging discreto.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}