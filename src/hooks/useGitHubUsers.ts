import { useState, useEffect } from "react";
import type { GitHubUser } from "@/types/github";
import { toast } from "react-hot-toast";

const GITHUB_API_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const headers = GITHUB_API_TOKEN
  ? { Authorization: `Bearer ${GITHUB_API_TOKEN}` }
  : undefined;

export function useGitHubUsers() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        // Si hay término de búsqueda, usar la API de búsqueda
        const url = searchTerm
          ? `https://api.github.com/search/users?q=${encodeURIComponent(searchTerm)}`
          : "https://api.github.com/users?per_page=20";

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: ${response.statusText}`
          );
        }

        const data:GitHubUser[] = await response.json();

        setUsers(data.filter(user => user !== null) as GitHubUser[]);

      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Error al cargar usuarios. Por favor, intenta de nuevo."
        );
        console.error("Error en fetchUsers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchUsers, searchTerm ? 500 : 0);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return { users, searchTerm, isLoading, setSearchTerm };
}
