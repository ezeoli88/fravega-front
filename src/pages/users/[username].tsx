import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import type { GitHubUser } from "@/types/github";

interface UserDetailsProps {
  user: GitHubUser;
}

const GITHUB_API_TOKEN = process.env.GITHUB_TOKEN;

export default function UserDetails({ user }: UserDetailsProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(user.login);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al listado
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar y acciones */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-48 w-48">
                <Image
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  fill
                  sizes="auto"
                  className="rounded-full object-cover"
                />
              </div>
              <button
                onClick={() => toggleFavorite(user.login)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  favorite
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700 hover:bg-yellow-50"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    favorite ? "text-yellow-500" : "text-gray-400"
                  }`}
                  fill={favorite ? "currentColor" : "none"}
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
                {favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              </button>
            </div>

            {/* Información del usuario */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.name || user.login}
              </h1>
              <h2 className="text-xl text-gray-600 mb-4">@{user.login}</h2>

              {user.bio && (
                <p className="text-gray-700 mb-6">{user.bio}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span>
                    <strong>{user.public_repos}</strong> repositorios
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>
                    <strong>{user.followers}</strong> seguidores ·{" "}
                    <strong>{user.following}</strong> siguiendo
                  </span>
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-3">
                {user.company && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    {user.company}
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {user.location}
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <a
                      href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {user.blog}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<UserDetailsProps> = async (context) => {
  const { username } = context.params as { username: string };
  const headers = GITHUB_API_TOKEN
    ? { Authorization: `Bearer ${GITHUB_API_TOKEN}` }
    : undefined;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      notFound: true,
    };
  }
};
