import Campaign from '../models/campaign.js';

export default {
    campaigns() {
        return Campaign.find();
    },
    createCampaign(input) {
        const newCampaign = new Campaign(input);
        return newCampaign.save();
    }
}
