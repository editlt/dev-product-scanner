const axios = require("axios");
const { connect } = require("mongoose");
const { Client, EmbedBuilder } = require("discord.js");
const devproducts = require("./schemas/devproducts");
require("dotenv").config();

const Types = {
    NEW_ITEM: "newItem",
    NEW_PRICE: "newPrice",
    NEW_IMAGE: "newImage",
    NEW_NAME: "newName",
    NEW_DESCRIPTION: "newDescription",
};

const client = new Client({ intents: [] });
client.login(process.env.BOT_TOKEN);


let placeChannelMapping = new Map();
try {
    const mappingsArray = JSON.parse(process.env.PLACE_CHANNELS || "[]");
    placeChannelMapping = new Map(mappingsArray.map((mapping) => mapping.split(":")));
} catch (error) {
    console.error("Error initializing place-channel mappings:", error);
}

const getChannelForPlace = (placeId) => placeChannelMapping.get(placeId.toString());
const getAllPlaceIds = () => Array.from(placeChannelMapping.keys());


async function fetchWithRetry(url, options, retries = 3) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if(attempt > 0)console.log(`retrying: ${url} [${attempt}]`)
            const response = await axios.get(url, options);
            return response.data;
        } catch (error) {
            if (attempt === retries) throw error;
            await delay(1000);
        }
    }
};

const convertToUniverse = (placeId) => fetchWithRetry(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);

async function fetchProducts(placeId) {
    console.log(placeId)
    const universeId = await convertToUniverse(placeId);
    console.log(universeId)
    const finalData = [];
    let page = 1;

    while (true) {
        const { DeveloperProducts = [] } = await fetchWithRetry(
            `https://apis.roblox.com/developer-products/v1/developer-products/list`,
            { params: { universeId, page } }
        );

        if (DeveloperProducts.length === 0) break;

        finalData.push(...DeveloperProducts.map((product) => ({ ...product, placeId })));
        page++;
    }

    return finalData;
};

async function getPlaceName(placeId) {
    const data = await fetchWithRetry(`https://www.roblox.com/places/api-get-details`, {params: { assetId: placeId }})
    
    return data.name || "Unknown Place"
}

async function monitorProducts () {
    const placeIds = getAllPlaceIds();

    while (true) {
        for (const placeId of placeIds) {
            try {
                console.log(placeId)
                const oldData = await devproducts.find({ placeId })
                const newData = await fetchProducts(placeId)

                console.log(newData)
        
                const updates = newData.map(async (newProduct) => {
                    const oldProduct = oldData.find((data) => data.DeveloperProductId === newProduct.DeveloperProductId);

                    if (!oldProduct) {
                        await sendEmbed(newProduct, null, Types.NEW_ITEM);
                        await devproducts.create(newProduct);
                    };
                    
                    return handleUpdates(newProduct, oldProduct);
                });

                for (const update of updates) await update?.();
           

            } catch (error) {
                console.error("Error in main loop:", error.message);
            }
        }

        await delay(10*1000);
    }
};

function handleUpdates(newProduct, oldProduct) {
    const updates = [];

    if (newProduct.PriceInRobux !== oldProduct.PriceInRobux) updates.push(() => sendEmbed(newProduct, oldProduct, Types.NEW_PRICE));
    if (newProduct.IconImageAssetId !== oldProduct.IconImageAssetId) updates.push(() => sendEmbed(newProduct, oldProduct, Types.NEW_IMAGE));
    if (newProduct.Name !== oldProduct.Name) updates.push(() => sendEmbed(newProduct, oldProduct, Types.NEW_NAME));
    if (newProduct.Description !== oldProduct.Description && newProduct.Description) updates.push(() => sendEmbed(newProduct, oldProduct, Types.NEW_DESCRIPTION));

    if (updates.length > 0)
        return async () => {
            for (const update of updates) await update();
            await devproducts.updateOne(
                { DeveloperProductId: newProduct.DeveloperProductId, placeId: newProduct.placeId },
                newProduct
            );
        };
};

async function sendEmbed(productData, oldProduct, type) {
    const validateField = (value) => value?.toString() || "N/A";

    try {
        const placeName = await getPlaceName(productData.placeId);
        const channelId = getChannelForPlace(productData.placeId);
        if (!channelId) return;

        let color;
        if (type === Types.NEW_ITEM) color = 0x00ffff;
        else if (type === Types.NEW_PRICE) color = 0xffd700;
        else if (type === Types.NEW_IMAGE) color = 0x1910e6;
        else if (type === Types.NEW_NAME) color = 0x802ef2;
        else color = 0xde6c10;

        const embed = new EmbedBuilder()
            .setTitle(validateField(productData.Name))
            .setURL(`https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)}`)
            .setThumbnail(`https://rbxgleaks.pythonanywhere.com/asset/${validateField(productData.IconImageAssetId)}`)
            .addFields(
                { name: "Place Name", value: placeName, inline: true },
                { name: "Developer Product ID", value: validateField(productData.DeveloperProductId), inline: true }
            )
            .setColor(color)
            .setAuthor({ name: type.replace(/([A-Z])/g, " $1").trim() });

        if (type === Types.NEW_ITEM) {
            embed.addFields(
                { name: "Description", value: validateField(productData.Description), inline: true },
                { name: "Price", value: validateField(productData.PriceInRobux.toLocaleString()), inline: true }
            );
        } else if (oldProduct) {
            embed.addFields({
                name: type.replace("new", ""),
                value: `${validateField(oldProduct[type.replace("new", "")])} → ${validateField(productData[type.replace("new", "")])}`,
                inline: true,
            });
        }

        const channel = client.channels.cache.get(channelId) || (await client.channels.fetch(channelId).catch(() => null));
        if (channel) await channel.send({ embeds: [embed] });
    } catch (error) {
        console.error("Error sending embed:", error.message);
    }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
    try {
        await connect(process.env.MONGO_DB_TOKEN);
        console.log("Database connected successfully");
        await monitorProducts();
    } catch (error) {
        console.error("Error initializing application:", error.message);
    }
})();
