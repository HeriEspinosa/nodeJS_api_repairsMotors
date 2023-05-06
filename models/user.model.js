const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('admin', 'client', 'employee'),
        allowNull: false,
        defaultValue: 'client',
    },
    status: {
        type: DataTypes.ENUM('available', 'disabled'),
        defaultValue: 'available',
        allowNull: false,
    },
});

module.exports = User;
