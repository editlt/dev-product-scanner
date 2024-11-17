const { Schema, model } = require("mongoose");

const devProducts = new Schema({
    ProductId: Number,
    DeveloperProductId: Number,
    Name: { type: String, default: "N/A" },
    Description: { type: String, default: "N/A" },
    IconImageAssetId: { type: Number, default: "1818" },
    displayName: { type: String, default: "N/A" },
    displayDescription: { type: String, default: "N/A" },
    displayIcon: { type: Number, default: "1818" },
    PriceInRobux: Number,
    placeId: Number
});

devProducts.index({ DeveloperProductId: 1, placeId: 1 }), { unique: true }

module.exports = model("devProducts", devProducts, "devProducts")