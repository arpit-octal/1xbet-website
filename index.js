require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 5000, pingTimeout: 3000, cookie: false });
require('./helpers/socketWork')(io)

// db init
const db = require("./models/index");
db.initialize();

var corsOption = {
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // credentials: true,
    exposedHeaders: ["x-access-token"],
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));


const morgan = require('morgan')
app.use(morgan('dev'))

// adminRouters
const adminsRouter = require("./routes/admins/admins.route");
const adminsSportRouter = require("./routes/admins/sport.route");
const adminsTournamentRouter = require("./routes/admins/tournament.route");
const adminsMatchRouter = require("./routes/admins/match.route");
const adminTransactionRouter = require("./routes/admins/transactions.route");
const adminMessageRouter = require("./routes/admins/message.route");
const adminsBetsRouter = require("./routes/admins/bets.route");
const adminsBetResultRouter = require("./routes/admins/bet-result.route");
const adminsSettingsRouter = require("./routes/admins/settings.route");
const adminsSiteSettingRouter = require("./routes/admins/site-setting.route");
const adminsReportRouter = require("./routes/admins/report.route");
const adminsPaymentsRouter = require("./routes/admins/payments.route");

// userRouters
const userRouter = require("./routes/users/user.route");
const userSportRouter = require("./routes/users/sport.route");
const userMatchRouter = require("./routes/users/match.route");
const transactionRouter = require("./routes/users/transaction.route");
const messageRouter = require("./routes/users/message.route");
const siteSettingRouter = require("./routes/users/site-setting.route");
const paymentsRouter = require("./routes/users/payment.route");


// cronRouters
const cronThirdPartyRouter = require('./routes/cron/third-party.routes');

// casino
const casinoAccountRouter = require('./routes/casino/wallet');
const casinoRouter = require("./routes/casino/casino")


// mount admins router
app.use("/v1/admin", adminsRouter);
app.use("/v1/admin/sport", adminsSportRouter);
app.use("/v1/admin/tournament", adminsTournamentRouter);
app.use("/v1/admin/match", adminsMatchRouter);
app.use("/v1/admin/transaction", adminTransactionRouter);
app.use("/v1/admin/message", adminMessageRouter);
app.use("/v1/admin/bets", adminsBetsRouter);
app.use("/v1/admin/bet-result", adminsBetResultRouter);
app.use("/v1/admin/settings", adminsSettingsRouter);
app.use("/v1/admin/site-setting", adminsSiteSettingRouter);
app.use("/v1/admin/report", adminsReportRouter);
app.use("/v1/admin/payments", adminsPaymentsRouter);

// mount users router
app.use("/v1/user", userRouter);
app.use("/v1/user/sport", userSportRouter);
app.use("/v1/user/match", userMatchRouter);
app.use("/v1/user/transaction", transactionRouter);
app.use("/v1/user/message", messageRouter);
app.use("/v1/user/site-setting", siteSettingRouter);
app.use("/v1/user/payment", paymentsRouter);

// casino
app.use("/v1/wallet", casinoAccountRouter);
app.use("/v1", casinoRouter);

// mount cron router
app.use("/v1/cron", cronThirdPartyRouter);

// image path
app.use("/img", express.static(path.join(__dirname, "public/images/")));

server.listen(process.env.PORT, () => {
    console.log("Server is running at PORT", process.env.PORT);
});

app.use(function (req, res) {
    res.status(404).json({
        status: 404,
        message: "Sorry can't find that!",
        data: {},
    });
});