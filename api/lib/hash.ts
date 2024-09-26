const createHash = async (string: string) => {
    const bcryptHash = await Bun.password.hash(string, {
        algorithm: 'bcrypt',
        cost: 4, // number between 4-31
    });
    return bcryptHash;
};

const verifyHash = async (string: string, hash: string) => {
    const isValid = await Bun.password.verify(string, hash, 'bcrypt');
    return isValid;
};

export { createHash, verifyHash };