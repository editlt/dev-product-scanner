require('dotenv').config();

class PlaceChannelMapping {
    constructor() {
        this.mappings = new Map();
        this.initializeMappings();
    }

    initializeMappings() {
        try {
            const mappingsArray = JSON.parse(process.env.PLACE_CHANNELS);
            
            for (const mapping of mappingsArray) {
                const [placeId, channelId] = mapping.split(':');
                this.mappings.set(placeId, channelId);
            }
        } catch (error) {
            console.error('Error initializing place-channel mappings:', error);
        }
    }

    getChannelForPlace(placeId) {
        return this.mappings.get(placeId.toString());
    }

    getAllPlaceIds() {
        return Array.from(this.mappings.keys());
    }

    getAllChannelIds() {
        return Array.from(this.mappings.values());
    }
}

module.exports = new PlaceChannelMapping();