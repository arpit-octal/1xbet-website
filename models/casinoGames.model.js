const mongoose = require("mongoose");

const CasinoGamesSchema = new mongoose.Schema({
    casinoGameId: { type: String },
    game_id: { type: String },
    game_name: { type: String },
    category: { type: String },
    provider_name: { type: String },
    sub_provider_name: { type: String },
    status: { type: String },
    url_thumb: { type: String },
    game_code: { type: String },
    top_games: { type: Number, default: 0 }
},
    {
        timestamps: true,
        toObject: { getters: true, setters: true, virtuals: false },
        toJSON: { getters: true, setters: true, virtuals: false }
    }
);


const CasinoGames = mongoose.model("casino_games", CasinoGamesSchema);

module.exports = CasinoGames;