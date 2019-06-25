const transactionDataReducer = (state = {}, action) => {
    switch(action.type){
        case "GET_DATA":
            return state;
        case "SET_DATA":
            return action.payload;
        default:
            return state;
    }
};

export default transactionDataReducer;