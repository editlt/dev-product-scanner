const Types = require("./types");
const { EmbedBuilder } = require("@discordjs/builders");
const getPlaceName = require("./getPlaceName");
const placeChannelMapping = require("./placeChannelMapping");

require("dotenv").config();

const sendEmbed = async (productData, oldProduct, type, client) => {
    const validateField = (value) => {
        return value !== null && value !== undefined ? value.toString() : "N/A";
    };

    try {
        const placeName = await getPlaceName(productData.placeId);
        const channelId = placeChannelMapping.getChannelForPlace(productData.placeId);

        if (!channelId) {
            console.error(`No channel mapping found for placeId: ${productData.placeId}`);
            return;
        }

        let embed;
        const baseEmbed = new EmbedBuilder()
            .setTitle(validateField(productData.Name))
            .setURL(`https://roblox.com/developer-products/${validateField(productData.DeveloperProductId)}`)
            .setThumbnail(`https://rbxgleaks.pythonanywhere.com/asset/${validateField(productData.IconImageAssetId)}`)
            .addFields(
                {
                    name: 'Place Name',
                    value: placeName,
                    inline: true,
                },
                {
                    name: 'Developer Product ID',
                    value: validateField(productData.DeveloperProductId),
                    inline: true,
                }
            );

        switch (type) {
            case Types.newItem:
                embed = baseEmbed
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
                            value: validateField(productData.PriceInRobux.toLocaleString()),
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
                        }
                    );
                break;
            case Types.newPrice:
                embed = baseEmbed
                    .setAuthor({
                        name: 'Price Change',
                    })
                    .setColor(0xffd700)
                    .addFields(
                        {
                            name: 'Price',
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
                        }
                    );
                break;
            case Types.newImage:
                embed = baseEmbed
                    .setAuthor({
                        name: 'Icon Change',
                    })
                    .setColor(0x1910E6)
                    .addFields(
                        {
                            name: 'Image Asset Id',
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
                        }
                    );
                break;
            case Types.newName:
                embed = baseEmbed
                    .setAuthor({
                        name: 'Name Change',
                    })
                    .setColor(0x802ef2)
                    .addFields(
                        {
                            name: 'Name',
                            value: `${validateField(oldProduct.Name)} => ${validateField(productData.Name)}`,
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
                            name: "Image Asset Id",
                            value: validateField(productData.IconImageAssetId),
                            inline: true
                        }
                    );
                break;
            case Types.newDescription:
                embed = baseEmbed
                    .setAuthor({
                        name: 'Description Change',
                    })
                    .setColor(0xde6c10)
                    .addFields(
                        {
                            name: 'Description',
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
                        }
                    );
                break;
        }

        const channel = client.channels.cache.get(channelId) ?? 
                       (await client.channels.fetch(channelId));
        
        if (!channel) {
            console.error(`Could not find channel with ID: ${channelId}`);
            return;
        }

        await channel.send({
            embeds: [embed]
        });
    } catch (error) {
        console.error("Error sending embed:", error);
    }
};

module.exports = sendEmbed;
