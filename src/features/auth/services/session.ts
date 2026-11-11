import Cookies from 'js-cookie';

function isAuthenticated(): boolean {
    const token = Cookies.get('authToken');
    return token ? true : false;
}

function isDemo(): boolean {
    const token = Cookies.get('authToken');
    return token === 'demo';
}

function logout() {
    Cookies.remove('authToken');
}

function login(token: string) {
    Cookies.set('authToken', token, { expires: 31, secure: true, sameSite: 'strict' }); 
}

function getToken(): string | undefined {
    return Cookies.get('authToken');
}

export { isAuthenticated, isDemo, logout, login, getToken };