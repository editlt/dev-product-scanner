// current version: v1.1.8

const { connect } = require('mongoose');
require("dotenv").config();
const fetchProducts = require("./fetchProducts");
const sendEmbed = require("./sendEmbed");
const Types = require("./types");
const { Client } = require("discord.js");
const devproducts = require('./schemas/devproducts');
const placeChannelMapping = require("./placeChannelMapping");

const wait = async (time) => {
    return await new Promise((e) => setTimeout(e, time));
};

const client = new Client({ intents: [] });
client.login(process.env.bot_token);

(async () => {
    await connect(process.env.mongo_db_token);
    const placeIds = placeChannelMapping.getAllPlaceIds();

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
                        await sendEmbed(
                            newProduct,
                            oldProduct,
                            Types.newItem,
                            client
                        );
                        await new devproducts(newProduct).save();
                        await wait(400);
                        continue;
                    }

                    if (newProduct.PriceInRobux !== oldProduct.PriceInRobux) {
                        await sendEmbed(newProduct, oldProduct, Types.newPrice, client);
                    } else if (newProduct.IconImageAssetId !== oldProduct.IconImageAssetId) {
                        await sendEmbed(newProduct, oldProduct, Types.newImage, client);
                    } else if (newProduct.Name !== oldProduct.Name) {
                        await sendEmbed(newProduct, oldProduct, Types.newName, client);
                    } else if (newProduct.Description !== oldProduct.Description) {
                        if (newProduct.Description == "") {
                            continue;
                        } else {
                            await sendEmbed(newProduct, oldProduct, Types.newDescription, client);
                        }
                    } else {
                        continue;
                    }

                    await devproducts.updateOne(
                        {
                            DeveloperProductId: newProduct.DeveloperProductId,
                            placeId: newProduct.placeId
                        },
                        newProduct
                    );
                    await wait(400);
                }
            }
            await wait(6_000);
        } catch (error) {
            console.error(`error: ${error}`)
        }
    }
})();