export const setDestionationPath = (path) => {
    localStorage.setItem('@questione/destination_path', path);
};

export const getDestionationPath = () => localStorage.getItem('@questione/destination_path');

export const removeDestionationPath = () => {
    localStorage.removeItem('@questione/destination_path');
};