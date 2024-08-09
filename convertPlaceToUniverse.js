async function convertToUniverse(placeId) {
    return fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
        .then(response => response.json())
        .then(data => data.universeId);
}
module.exports = convertToUniverse;