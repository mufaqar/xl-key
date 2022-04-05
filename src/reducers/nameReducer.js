const nameReducer = (name =false, action) => {
    switch(action.type) {
        case 'SET_NAME':
            name = action.payload;
            return name;
        case 'GET_NAME':
            return name;
        default:
            return name;
    }
}

export default nameReducer;
