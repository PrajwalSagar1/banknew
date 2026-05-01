export const generateAccountNumber = () => {
    // Generate a 12-digit random account number
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};
