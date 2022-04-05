const loggedReducer = (state =false, action) => {
    switch(action.type) {
        case 'SIGN_IN':
            state = true;
            return state;
        case 'SIGN_OUT':
            state = false;
            return state;
        default:
            return state;
    }
}

export default loggedReducer;
