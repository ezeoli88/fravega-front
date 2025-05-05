import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/context/FavoritesContext";
import useSWR from "swr";
import { useState, useEffect } from "react";
import type { GitHubSearchResponse, GitHubUser } from "@/types/github";
import { mutate } from "swr";
import { fetcher } from "@/api/services";


export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();

  const url = searchTerm
    ? `https://api.github.com/search/users?q=${encodeURIComponent(searchTerm)}`
    : "https://api.github.com/users?per_page=20";

  const { data: users = [], isLoading } = useSWR<GitHubSearchResponse | GitHubUser[]>(
    url,
    fetcher
  );

  const userList = searchTerm ? (users as GitHubSearchResponse).items : users;
  

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        mutate(url);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, url]);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Usuarios de GitHub
        </h1>

        {/* Buscador */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Estado de carga y error */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}


        {/* Lista de usuarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userList === undefined ?
            null :  (userList as GitHubUser[]).map((user: GitHubUser) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <Link
                  href={`/users/${user.login}`}
                  className="flex items-center space-x-4 flex-1"
                >
                  <div className="relative h-16 w-16">
                    <Image
                      src={user.avatar_url}
                      alt={user.login}
                      fill
                      sizes="auto"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                      {user.login}
                    </h2>
                    <p className="text-gray-600">Ver perfil</p>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(user.login);
                  }}
                  className="focus:outline-none"
                >
                  {isFavorite(user.login) ? (
                    <svg
                      className="w-6 h-6 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-400 hover:text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {!isLoading && (userList as GitHubUser[]).length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No se encontraron usuarios
          </div>
        )}
      </div>
    </main>
  );
}
