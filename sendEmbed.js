const Types = require("./types");
const { EmbedBuilder } = require("@discordjs/builders");

require("dotenv").config();

const sendEmbed = async (productData, oldProduct, type, client) => {
    const channelIds = JSON.parse(process.env.channelIds)

    // Helper function to validate and convert field values to strings
    const validateField = (value) => {
        return value !== null && value !== undefined ? value.toString() : "N/A";
    };

    try {
        let embed;

        switch (type) {
            case Types.newItem:
                embed = new EmbedBuilder()
                    .setTitle(validateField(productData.Name))
                    .setURL(`https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)}`)
                    .setThumbnail(`https://rbxgleaks.pythonanywhere.com/asset/${validateField(productData.IconImageAssetId)}`)
                    .setColor(0x00ffff)
                    .setAuthor({
                        name: 'New Developer Product',
                    })
                    .addFields(
                        {
                            name: 'Description',
                            value: validateField(productData.Description),
                            inline: true,
                        },
                        {
                            name: 'Price',
                            value: validateField(productData.PriceInRobux),
                            inline: true,
                        },
                        {
                            name: 'Link',
                            value: `[Here](https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)})`,
                            inline: true,
                        },
                        {
                            name: 'Image Asset Id',
                            value: validateField(productData.IconImageAssetId),
                            inline: true,
                        },
                        {
                            name: 'Developer Product ID',
                            value: validateField(productData.DeveloperProductId),
                            inline: true,
                        }
                    );
                break;
            case Types.newPrice:
                embed = new EmbedBuilder()
                    .setTitle(validateField(productData.Name))
                    .setURL(`https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)}`)
                    .setThumbnail(`https://rbxgleaks.pythonanywhere.com/asset/${validateField(productData.IconImageAssetId)}`)
                    .setAuthor({
                        name: 'Price Change',
                    })
                    .setColor(0xffd700)
                    .addFields(
                        {
                            name: 'New Price',
                            value: `${validateField(oldProduct.PriceInRobux)} => ${validateField(productData.PriceInRobux)}`,
                            inline: true,
                        },
                        {
                            name: 'Link',
                            value: `[Here](https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)})`,
                            inline: true,
                        },
                        {
                            name: "Image Asset Id",
                            value: validateField(productData.IconImageAssetId),
                            inline: true
                        },
                        {
                            name: 'Description',
                            value: validateField(productData.Description),
                            inline: true,
                        },
                        {
                            name: 'Developer Product ID',
                            value: validateField(productData.DeveloperProductId),
                            inline: true,
                        },
                    );
                break;
            case Types.newImage:
                embed = new EmbedBuilder()
                    .setTitle(validateField(productData.Name))
                    .setURL(`https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)}`)
                    .setThumbnail(`https://rbxgleaks.pythonanywhere.com/asset/${validateField(productData.IconImageAssetId)}`)
                    .setAuthor({
                        name: 'Icon Change',
                    })
                    .setColor(0x1910E6)
                    .addFields(
                        {
                            name: 'New Image ID',
                            value: `${validateField(oldProduct.IconImageAssetId)} => ${validateField(productData.IconImageAssetId)}`,
                            inline: true,
                        },
                        {
                            name: 'Description',
                            value: validateField(productData.Description),
                            inline: true,
                        },
                        {
                            name: 'Price',
                            value: validateField(productData.PriceInRobux),
                            inline: true,
                        },
                        {
                            name: 'Link',
                            value: `[Here](https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)})`,
                            inline: true,
                        },
                        {
                            name: 'Developer Product ID',
                            value: validateField(productData.DeveloperProductId),
                            inline: true,
                        },
                    );
                break;
            case Types.newName:
                embed = new EmbedBuilder()
                    .setTitle(`${validateField(oldProduct.Name)} => ${validateField(productData.Name)}`)
                    .setURL(`https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)}`)
                    .setThumbnail(`https://rbxgleaks.pythonanywhere.com/asset/${validateField(productData.IconImageAssetId)}`)
                    .setAuthor({
                        name: 'Name Change',
                    })
                    .setColor(0x802ef2)
                    .addFields(
                        {
                            name: 'Description',
                            value: validateField(productData.Description),
                            inline: true,
                        },
                        {
                            name: 'Price',
                            value: validateField(productData.PriceInRobux),
                            inline: true,
                        },
                        {
                            name: 'Link',
                            value: `[Here](https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)})`,
                            inline: true,
                        },
                        {
                            name: "Image Asset Id",
                            value: validateField(productData.IconImageAssetId),
                            inline: true
                        },
                        {
                            name: 'Developer Product ID',
                            value: validateField(productData.DeveloperProductId),
                            inline: true,
                        },
                    );
                break;
            case Types.newDescription:
                embed = new EmbedBuilder()
                    .setTitle(validateField(productData.Name))
                    .setURL(`https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)}`)
                    .setThumbnail(`https://rbxgleaks.pythonanywhere.com/asset/${validateField(productData.IconImageAssetId)}`)
                    .setAuthor({
                        name: 'Description Change',
                    })
                    .setColor(0xde6c10)
                    .addFields(
                        {
                            name: 'New Description',
                            value: `${validateField(oldProduct.Description)} => ${validateField(productData.Description)}`,
                            inline: true,
                        },
                        {
                            name: 'Price',
                            value: validateField(productData.PriceInRobux),
                            inline: true,
                        },
                        {
                            name: 'Link',
                            value: `[Here](https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)})`,
                            inline: true,
                        },
                        {
                            name: "Image Asset Id",
                            value: validateField(productData.IconImageAssetId),
                            inline: true
                        },
                        {
                            name: 'Developer Product ID',
                            value: validateField(productData.DeveloperProductId),
                            inline: true,
                        },
                    );
                break;
            default:
                break;
        }

        for (const channelId of channelIds) {
            const channel =
                client.channels.cache.get(channelId) ??
                (await client.channels.fetch(channelId))
            await channel.send({
                embeds: [embed]
            });
        }
    } catch (error) {
        console.error("Error sending embed:", error);
    }
};

module.exports = sendEmbed;