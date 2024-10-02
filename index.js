// current version: v1.1

const { connect } = require('mongoose');
require("dotenv").config();
const fetchProducts = require("./fetchProducts");
const sendEmbed = require("./sendEmbed");
const Types = require("./types");
const { Client } = require("discord.js");
const devproducts = require('./schemas/devproducts');

const wait = async (time) => {
    return await new Promise((e) => setTimeout(e, time));
};

const client = new Client({ intents: [] });
client.login(process.env.bot_token);

(async () => {
    await connect(process.env.mongo_db_token);

    const placeIds = JSON.parse(process.env.placeIds);

    while (true) {
        try {
            for (const placeId of placeIds) {
                let oldData = await devproducts.find({ placeId });
                let newData = await fetchProducts(placeId);
                for (const newProduct of newData) {
                    const oldProduct = oldData.find((data) => {
                        return data.DeveloperProductId == newProduct.DeveloperProductId;
                    });

                    if (!oldProduct) {
                        sendEmbed(
                            newProduct,
                            oldProduct,
                            Types.newItem,
                            client
                        );
                        new devproducts(newProduct).save();
                        await wait(400);
                        continue;
                    } else if (newProduct.PriceInRobux !== oldProduct.PriceInRobux) {
                        sendEmbed(
                            newProduct,
                            oldProduct,
                            Types.newPrice,
                            client
                        );
                    } else if (newProduct.IconImageAssetId !== oldProduct.IconImageAssetId) {
                        sendEmbed(
                            newProduct,
                            oldProduct,
                            Types.newImage,
                            client
                        );
                    } else if (newProduct.Name !== oldProduct.Name) {
                        sendEmbed(
                            newProduct,
                            oldProduct,
                            Types.newName,
                            client
                        );
                    } else if (newProduct.Description !== oldProduct.Description) {
                        sendEmbed(
                            newProduct,
                            oldProduct,
                            Types.newDescription,
                            client
                        );
                    } else {
                        continue;
                    }

                    await devproducts.updateOne(
                        {
                            ProductId: newProduct.ProductId,
                            placeId: newProduct.placeId
                        },
                        newProduct
                    );
                    await wait(400);
                }
            }
            await new Promise((e) => setTimeout(e, 6_000));
        } catch (error) {
            console.error(`error: ${error}`)
        }
    }
})();