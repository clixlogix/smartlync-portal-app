export const users = [
    { name: 'Vikrant Gupta', email: 'vikrantgupta.psit@gmail.com', active: true },
    { name: 'David Simmons', email: 'davidsimons@gmail.com', active: false },
    { name: 'Aisha Williams', email: 'aishawilliams@gmail.com', active: true },
];
export const createData = (name, email, active) => {
    return {
        name,
        email,
        active,
    };
};
