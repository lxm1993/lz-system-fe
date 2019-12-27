const bcrypt = require('bcrypt');
const saltRounds = 10;

const enbcrypt = async password => {
    let salt = await bcrypt.genSaltSync(saltRounds);
    return await bcrypt.hashSync(password, salt);
};

const validate = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
};

module.exports = {
    enbcrypt,
    validate
};