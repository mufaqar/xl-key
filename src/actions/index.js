export const setToken = (token) => {
    return {
        type: 'SET_TOKEN',
        payload: token
    };
}
export const getToken = () => {
    return {
        type: 'GET_TOKEN'
    };
}
export const setName = (name) => {
    return {
        type: 'SET_NAME',
        payload: name
    };
}
export const getName = () => {
    return {
        type: 'GET_NAME'
    };
}
export const setLogo = (logo) => {
    return {
        type: 'SET_LOGO',
        payload: process.env.REACT_APP_IMAGE_URL+logo
    };
}
export const getLogo = () => {
    return {
        type: 'GET_LOGO'
    };
}
export const setLanguage = (lang) => {
    return {
        type: 'SET_LANG',
        payload: lang
    };
}
export const getLanguage = () => {
    return {
        type: 'GET_LANG'
    };
}
export const setUserRole = (userrole) => {
    return {
        type: 'SET_USERROLE',
        payload: userrole
    };
}
export const getUserRole = () => {
    return {
        type: 'GET_USERROLE'
    };
}
export const setLogin = () => {
    return {
        type: 'SIGN_IN'
    };
}
export const setLogout = () => {
    return {
        type: 'SIGN_OUT'
    };
}