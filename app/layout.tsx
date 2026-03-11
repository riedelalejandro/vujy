import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vujy — Plataforma Educativa",
  description:
    "Copiloto institucional con IA para escuelas privadas argentinas. Gestión académica, comunicación y pagos desde una conversación.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
