import userRoleReducer from './userRoleReducer';
import tokenReducer from './tokenReducer';
import userLangReducer from './userLangReducer';
import nameReducer from './nameReducer';
import logoReducer from './logoReducer';
import loggedReducer from './isLogged';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    logo: logoReducer,
    name: nameReducer,
    token: tokenReducer,
    userRole: userRoleReducer,
    isLogged: loggedReducer,
    userLang: userLangReducer,
});

export default allReducers;
