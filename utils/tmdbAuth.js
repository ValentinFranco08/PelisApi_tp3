import Constants from "expo-constants";

function resolveFromConstants() {
  const expoConfig = Constants?.expoConfig ?? Constants?.manifest ?? Constants?.manifest2;
  const extra = expoConfig?.extra ?? {};
  return extra.EXPO_PUBLIC_TMDB_API_KEY;
}

export function resolveTmdbAuth() {
  const env = typeof process !== "undefined" ? process.env : undefined;
  let key = env?.EXPO_PUBLIC_TMDB_API_KEY ?? resolveFromConstants();

  if (!key || key === "TU_API_KEY") {
    return null;
  }

  if (typeof key !== "string") {
    console.warn("EXPO_PUBLIC_TMDB_API_KEY debe ser un string");
    return null;
  }

  key = key.trim();
  const bearerPrefix = "bearer ";
  if (key.toLowerCase().startsWith(bearerPrefix)) {
    key = key.slice(bearerPrefix.length);
  }

  if (key.includes(".") && key.length > 40) {
    return { type: "bearer", token: key };
  }

  return { type: "api_key", token: key };
}

export function buildTmdbRequest(path, auth, init = {}) {
  const baseUrl = "https://api.themoviedb.org/3";
  let url = `${baseUrl}${path}`;
  const headers = { Accept: "application/json", ...(init.headers || {}) };

  if (!auth) {
    return { url, init: { ...init, headers } };
  }

  if (auth.type === "api_key") {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}api_key=${encodeURIComponent(auth.token)}`;
  } else if (auth.type === "bearer") {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  return { url, init: { ...init, headers } };
}