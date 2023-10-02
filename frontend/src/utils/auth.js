import decode from 'jwt-decode';

class AuthService {

    // Return user information found in the token
    getProfile() {
        return decode(this.getToken());
    }

    // If token exists and is not expired, user is logged in
    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    // Check if token is expired against its
    // timestamp found in 'exp'
    isTokenExpired(token) {
        try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
            return true;
        } else return false;
        } catch (err) {
        return false;
        }
    }

    getToken() {
        return localStorage.getItem('id_token');
    }

    // "log in" the user by setting token in local storage
    // and redirecting to home page
    login(idToken) {
        localStorage.setItem('id_token', idToken);

        window.location.assign('/');
    }

    // "log out" the user by removing local storage token
    // and redirecting to home page
    logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
}

const instance = new AuthService();

export default instance;
