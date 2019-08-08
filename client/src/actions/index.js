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

export const isMobileUser = (userIsOnMobileDevice) => {
    return {
        type: "IS_MOBILE_USER",
        payload: userIsOnMobileDevice
    };
};