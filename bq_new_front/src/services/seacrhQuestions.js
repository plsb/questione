export const QUESTION_SEARCH_TYPE = '@Questione-search-type';
export const QUESTION_SEARCH_ID = '@Questione-search-id';
export const QUESTION_SEARCH_COURSE = '@Questione-search-course';
export const QUESTION_SEARCH_SKILL = '@Questione-search-skill';
export const QUESTION_SEARCH_OBJECT = '@Questione-search-object';
export const QUESTION_SEARCH_KEYWORD = '@Questione-search-show-keyword';
export const QUESTION_SEARCH_PAGE = '@Questione-search-page';

export const searchQuestions = (type, id, course, skill, object, keyword) => {
    localStorage.setItem(QUESTION_SEARCH_TYPE, type);
    localStorage.setItem(QUESTION_SEARCH_ID, id);
    localStorage.setItem(QUESTION_SEARCH_COURSE, course);
    localStorage.setItem(QUESTION_SEARCH_SKILL, skill);
    localStorage.setItem(QUESTION_SEARCH_OBJECT, object);
    localStorage.setItem(QUESTION_SEARCH_KEYWORD, keyword);
};

export const searchQuestionsPage = (page) => {
    localStorage.setItem(QUESTION_SEARCH_PAGE, page);
};
