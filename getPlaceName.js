const getPlaceName = async (placeId) => {
    try {
        const response = await fetch(`https://www.roblox.com/places/api-get-details?assetId=${placeId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.Name;
    } catch (error) {
        console.error(`Error fetching place name for placeId ${placeId}:`, error);
        return "Unknown Place";
    }
};

module.exports = getPlaceName;