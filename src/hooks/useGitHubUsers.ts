import { useState, useEffect } from "react";
import type { GitHubUser, GitHubSearchResponse } from "@/types/github";

const GITHUB_API_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const headers = GITHUB_API_TOKEN
  ? { Authorization: `Bearer ${GITHUB_API_TOKEN}` }
  : undefined;

export function useGitHubUsers() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Si hay término de búsqueda, usar la API de búsqueda
        const url = searchTerm
          ? `https://api.github.com/search/users?q=${encodeURIComponent(searchTerm)}`
          : "https://api.github.com/users?per_page=30";

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Si es una búsqueda, los usuarios están en data.items
        // Asegurarse de que userList sea siempre un array
        const userList: GitHubUser[] = searchTerm ? (data as GitHubSearchResponse).items || [] : data || [];

        if (!Array.isArray(userList)) {
           console.error("La respuesta de la API no es un array:", userList);
           throw new Error("Formato de respuesta inesperado de la API de GitHub.");
        }

        // Para cada usuario, obtener detalles completos
        const detailedUsers = await Promise.all(
          userList.map(async (user: GitHubUser) => {
            // Asegurarse de que user y user.login existan antes de hacer fetch
            if (!user || !user.login) {
              console.warn("Usuario inválido encontrado:", user);
              return null; // O manejar de otra forma apropiada
            }
            try {
              const detailResponse = await fetch(
                `https://api.github.com/users/${user.login}`,
                { headers }
              );
              // Si la respuesta detallada falla, devolver el usuario básico si existe
              if (!detailResponse.ok) return user;
              return await detailResponse.json();
            } catch (detailError){
              console.error(`Error al obtener detalles para ${user.login}:`, detailError);
              return user; // Devolver usuario básico en caso de error en la llamada de detalle
            }
          })
        );

        // Filtrar posibles resultados nulos si se manejaron usuarios inválidos
        setUsers(detailedUsers.filter(user => user !== null) as GitHubUser[]);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar usuarios. Por favor, intenta de nuevo."
        );
        console.error("Error en fetchUsers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce fetch logic
    const debounceTimeout = setTimeout(fetchUsers, searchTerm ? 500 : 0);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return { users, searchTerm, isLoading, error, setSearchTerm };
}
