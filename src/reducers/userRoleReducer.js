const userRoleReducer = (state =false, action) => {
    switch(action.type) {
        case 'SET_USERROLE':
            state = action.payload;
            return state;
        case 'GET_USERROLE':
            return state;
        default:
            return state;
    }
}

export default userRoleReducer;
