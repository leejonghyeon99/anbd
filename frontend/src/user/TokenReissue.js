
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/reissue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to refresh token.');
        }
        
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        // Handle token refresh failure (e.g., redirect to login)
    }
}

async function fetchWithTokenRefresh(url, options = {}) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        
        // If unauthorized, try to refresh token
        if (response.status === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                // Retry original request with new access token
                return fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${newAccessToken}`,
                    },
                });
            }
        }
        
        return response;
    } catch (error) {
        console.error('Error during fetch with token refresh:', error);
        // Handle fetch failure
    }
}

export { fetchWithTokenRefresh };
