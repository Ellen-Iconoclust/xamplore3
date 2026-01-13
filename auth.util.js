const crypto = require('crypto');

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password, savedHash, savedSalt) {
    const hash = crypto.pbkdf2Sync(password, savedSalt, 1000, 64, 'sha512').toString('hex');
    return hash === savedHash;
}

module.exports = { hashPassword, verifyPassword };
