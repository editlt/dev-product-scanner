const { Schema, model } = require("mongoose");

const devProducts = new Schema({
    ProductId: Number,
    DeveloperProductId: Number,
    Name: { type: String, default: null },
    Description: { type: String, default: null },
    IconImageAssetId: { type: Number, default: null },
    displayName: { type: String, default: null },
    displayDescription: { type: String, default: null },
    displayIcon: { type: Number, default: null },
    PriceInRobux: Number,
    placeId: Number
});

devProducts.index({ DeveloperProductId: 1, placeId: 1 }), { unique: true }

module.exports = model("devProducts", devProducts, "devProducts")