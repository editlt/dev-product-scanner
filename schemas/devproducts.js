const { Schema, model } = require("mongoose");

const devProducts = new Schema({
    ProductId: Number,
    DeveloperProductId: Number,
    Name: String,
    Description: String,
    IconImageAssetId: Number,
    displayName: String,
    displayDescription: String,
    displayIcon: Number,
    PriceInRobux: Number,
    placeId: Number
});

devProducts.index({ DeveloperProductId: 1, placeId: 1 }), { unique: true }

module.exports = model("devProducts", devProducts, "devProducts")