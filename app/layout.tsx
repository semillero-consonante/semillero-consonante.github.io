import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://semillero-consonante.afrejad.chatgpt.site"),
  title: {
    default: "Semillero Consonante",
    template: "%s | Semillero Consonante",
  },
  description:
    "Semillero de la UPTC dedicado a la investigación de la literatura oral, la memoria, el mito, la leyenda y el territorio.",
  openGraph: {
    title: "Semillero Consonante",
    description: "Investigación de la literatura oral",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Semillero Consonante" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Semillero Consonante",
    description: "Investigación de la literatura oral",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
