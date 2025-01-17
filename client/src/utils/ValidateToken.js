export const validateToken = (token) => {
    if (!token) return false; // Token tidak ada

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload dari token
        const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
        return payload.exp > currentTime; // Return true jika token belum expired
    } catch (error) {
        console.error('Invalid token:', error);
        return false; // Token tidak valid
    }
};
  