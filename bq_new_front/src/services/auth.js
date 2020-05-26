export const TOKEN_KEY = '@Questione-token';
export const ID_USER = '@Questione-id-user';
export const NAME_USER = '@Questione-name-user';
export const EMAIL_USER = '@Questione-email-user';
export const LEVEL_USER = '@Questione-acess-level-user';
export const SHOW_TOUR = '@Questione-acess-show-tour';

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = (token, name, email, level, id, showTour) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(NAME_USER, name);
    localStorage.setItem(EMAIL_USER, email);
    localStorage.setItem(LEVEL_USER, level);
    localStorage.setItem(ID_USER, id);
    localStorage.setItem(SHOW_TOUR, showTour);
};

export const updateNameUser = (name) => {
    localStorage.setItem(NAME_USER, name);
};

export const updateShowTour = (showTour) => {
    localStorage.setItem(SHOW_TOUR, showTour);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_USER);
    localStorage.removeItem(EMAIL_USER);
    localStorage.removeItem(LEVEL_USER);
    localStorage.removeItem(ID_USER);
};
