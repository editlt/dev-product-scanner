const Types = require("./types");
const { EmbedBuilder } = require("@discordjs/builders");

require("dotenv").config();

const sendEmbed = async (productData, oldProduct, type, client) => {
    const channel =
        client.channels.cache.get(process.env.channelId) ??
        (await client.channels.fetch(process.env.channelId));

    // Helper function to validate and convert field values to strings
    const validateField = (value) => {
        return value !== null && value !== undefined ? value.toString() : "N/A";
    };

    try {
        switch (type) {
            case Types.newItem:
                const embed = new EmbedBuilder()
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
                await channel.send({
                    embeds: [embed],
                });
                break;

            case Types.newPrice:
                const embed2 = new EmbedBuilder()
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
                await channel.send({
                    embeds: [embed2]
                });
                break;

            case Types.newImage:
                const embed3 = new EmbedBuilder()
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
                await channel.send({
                    embeds: [embed3]
                });
                break;

            case Types.newName:
                const embed4 = new EmbedBuilder()
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
                await channel.send({
                    embeds: [embed4]
                });
                break;

            case Types.newDescription:
                const embed5 = new EmbedBuilder()
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
                await channel.send({
                    embeds: [embed5]
                });
                break;

            default:
                break;
        }
    } catch (error) {
        console.error("Error sending embed:", error);
    }
};

module.exports = sendEmbed;