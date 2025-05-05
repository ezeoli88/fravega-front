import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FavoritesProvider>
      <Component {...pageProps} />
      <Toaster />
    </FavoritesProvider>
  );
}
