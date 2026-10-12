const API_BASE_URL = 
    import.meta.env.VITE_API_URL !== undefined
        ? import.meta.env.VITE_API_URL
        : (import.meta.env.PROD ? '/graphelp' : 'http://localhost:8000');

export function getApiUrl(endpoint = '') {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
}

export default API_BASE_URL;
