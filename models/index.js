const mongoose = require("mongoose");
const cron = require("../helpers/cron");
async function initialize(msg) {
    try {
        const srv = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
        console.log({ srv })
        await mongoose.connect(srv,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // useCreateIndex: true
            }
        );
        console.log("+ MongoDB is connected!! +");
        cron.start_jobs()
    } catch (error) {
        console.error(error);
    }
}

module.exports.initialize = initialize;
