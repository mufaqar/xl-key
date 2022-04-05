const logoReducer = (logo =false, action) => {
    switch(action.type) {
        case 'SET_LOGO':
            logo = action.payload;
            return logo;
        case 'GET_LOGO':
            return logo;
        default:
            return logo;
    }
}

export default logoReducer;
