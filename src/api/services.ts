import toast from "react-hot-toast";

const GITHUB_API_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const headers = GITHUB_API_TOKEN
  ? { Authorization: `Bearer ${GITHUB_API_TOKEN}` }
  : undefined;

export async function fetcher(url: string) {
  try {
    const response = await fetch(url, { headers });    
    const data = await response.json();
    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al cargar usuarios";
    toast.error(message);
  }
}