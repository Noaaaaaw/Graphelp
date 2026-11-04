const API_BASE_URL = 
    import.meta.env.VITE_API_URL !== undefined
        ? import.meta.env.VITE_API_URL
        : (import.meta.env.PROD ? '/graphelp' : 'http://localhost:8000');

export function getApiUrl(endpoint = '') {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
}

export async function authFetch(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    const token = localStorage.getItem("token");

    const headers = new Headers(options.headers || {});
    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const mergedOptions = {
        ...options,
        headers,
    };

    const response = await fetch(url, mergedOptions);

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        const base = (import.meta.env.BASE_URL || '/graphelp/').replace(/\/+$/, '');
        const targetLogin = `${base}/login`;
        if (window.location.pathname !== targetLogin) {
            window.location.href = targetLogin;
        }
    }

    return response;
}

export function extractErrorMessage(data, fallback = "Terjadi kesalahan pada server.") {
    if (!data) return fallback;
    if (typeof data.detail === "string") {
        return data.detail;
    }
    if (Array.isArray(data.detail) && data.detail.length > 0) {
        const rawMsg = data.detail[0]?.msg || fallback;
        return rawMsg.replace(/^Value error,\s*/i, "");
    }
    return fallback;
}

export default API_BASE_URL;
