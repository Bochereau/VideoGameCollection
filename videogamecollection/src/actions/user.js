/*
LOGIN status
*/

// action to login with state
export const DO_LOGIN = 'DO_LOGIN';
export const doLogin = () => ({
  type: DO_LOGIN,
});

// action to logout with state
export const LOGOUT = 'LOGOUT';
export const logout = () => ({
  type: LOGOUT,
});

// action to signin with middleware
export const SIGNIN = 'SIGNIN';
export const signin = () => ({
  type: SIGNIN,
});

// action to add user in DB
export const ADD_USER = 'ADD_USER';
export const addUser = () => ({
  type: ADD_USER,
});

/*
USER FIELDS
*/

// action to change pseudo value
export const CHANGE_PSEUDO_VALUE = 'CHANGE_PSEUDO_VALUE';
export const changePseudoValue = (pseudoValue) => ({
  type: CHANGE_PSEUDO_VALUE,
  pseudoValue,
});

// action to change email value
export const CHANGE_EMAIL_VALUE = 'CHANGE_EMAIL_VALUE';
export const changeEmailValue = (emailValue) => ({
  type: CHANGE_EMAIL_VALUE,
  emailValue,
});

// action to change password value
export const CHANGE_PASSWORD_VALUE = 'CHANGE_PASSWORD_VALUE';
export const changePasswordValue = (passwordValue) => ({
  type: CHANGE_PASSWORD_VALUE,
  passwordValue,
});

// action to change verifiedPassword value
export const CHANGE_VERIFIED_PASSWORD_VALUE = 'CHANGE_VERIFIED_PASSWORD_VALUE';
export const changeVerifiedPasswordValue = (verifiedPasswordValue) => ({
  type: CHANGE_VERIFIED_PASSWORD_VALUE,
  verifiedPasswordValue,
});
