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