export const login = () => {
    return {
        type: "SIGN_IN"
    };
};

export const logout = () => {
    return {
        type: "SIGN_OUT"
    };
};

export const setTransactionData = (data) => {
    return {
        type: "SET_DATA",
        payload: data
    };
};

export const getTransactionData = () => {
    return {
        type: "GET_DATA"
    };
};