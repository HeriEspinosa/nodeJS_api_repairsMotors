const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

//ROUTERS
const userRouter = require('./routes/user.routes');
const repairRouter = require('./routes/repair.routes');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(xss());
app.use(hpp());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/repairs', repairRouter);

app.all('*', (req, res) => {
    return res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server ❌`,
    });
});

module.exports = app;
