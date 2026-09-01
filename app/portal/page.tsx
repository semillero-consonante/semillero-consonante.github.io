import type { Metadata } from "next";
import PortalClient from "./portal-client";

export const metadata: Metadata = {
  title: "Portal de integrantes",
  description: "Programación, lecturas, tareas y materiales del Semillero Consonante.",
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function PortalPage() {
  return <PortalClient />;
}
