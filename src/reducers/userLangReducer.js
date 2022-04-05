const userLangReducer = (state ="FR", action) => {
    switch(action.type) {
        case 'SET_LANG':
            state = action.payload;
            return state;
        case 'GET_LANG':
            return state;
        default:
            return state;
    }
}

export default userLangReducer;
