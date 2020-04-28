export const TOKEN_KEY = '@Questione-token';
export const NAME_USER = '@Questione-name-user';
export const EMAIL_USER = '@Questione-email-user';
export const LEVEL_USER = '@Questione-acess-level-user';

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = (token, name, email, level) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(NAME_USER, name);
    localStorage.setItem(EMAIL_USER, email);
    localStorage.setItem(LEVEL_USER, level);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_USER);
    localStorage.removeItem(EMAIL_USER);
    localStorage.removeItem(LEVEL_USER);
};
