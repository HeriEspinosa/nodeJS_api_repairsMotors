const Repair = require('./repair.model');
const User = require('./user.model');

const initModel = () => {
    //1 User <------> N Repair
    User.hasMany(Repair, { foreignKey: 'userId' });
    Repair.belongsTo(User, { foreignKey: 'userId' });
};

module.exports = initModel;
