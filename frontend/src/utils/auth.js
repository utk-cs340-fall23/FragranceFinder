import decode from 'jwt-decode';
import { sendGet } from './requests';

class AuthService {

    // Return user information found in the token
    getProfile() {
        const token = this.getToken();
        if (token) {
            return decode(this.getToken()).data;
        }
        return null;
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

    async validateToken() {
        if (!this.loggedIn()) {
            return false;
        }
        const response = await sendGet('/api/users/validate-token/');
        return (
            response.ok && response.data?.success
        );
    }

    getToken() {
        return localStorage.getItem('id_token');
    }

    removeToken() {
        localStorage.removeItem('id_token');
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
        this.removeToken();
        window.location.assign('/');
    }
}

const instance = new AuthService();

export default instance;
