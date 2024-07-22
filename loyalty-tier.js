const { BRONZE_TIER, SILVER_TIER, GOLD_TIER, AFTER_GOLD_TIER } = require('./constant')
const { calculateRewards } = require('./rewards-points')

/* Input : Expected Input Array from the client side (Orde) */
/* Output : Json formatted object for the client side  */
const calculateTier = (ordersList) => {

    //console.log('Arrived for Tier')

    var rewards = JSON.parse(calculateRewards(ordersList))

    const total_points = rewards.total_points

    const [tier, num_points_to_next_tier] = populateTier(total_points)

    var loyalty_tier = {
        tier: tier,
        num_points_to_next_tier: num_points_to_next_tier
    }

    return JSON.stringify(loyalty_tier)

}


/* Input : Expected the total points for customer */
/* Output : Current & Next Tier & Min Point Required for the customer  */
function populateTier(total_points) {

    //console.log('Arrived for Tier')

    var currentTier = 'none' //default tier
    var nextTier
    var num_points_to_next_tier = 0

    if (total_points >= GOLD_TIER.min_points_required) {
        //console.log('Checking the tier upper than gold for the point....', total_points)
        currentTier = GOLD_TIER.tier
        nextTier = AFTER_GOLD_TIER.tier

        num_points_to_next_tier = AFTER_GOLD_TIER.min_points_required
    }

    else if (total_points > SILVER_TIER.min_points_required && total_points < GOLD_TIER.min_points_required) {
        // console.log('Checking the tier between gold and silver for the point....', total_points)
        currentTier = SILVER_TIER.tier
        nextTier = GOLD_TIER.tier

        num_points_to_next_tier = GOLD_TIER.min_points_required - total_points
    }

    else if (total_points === SILVER_TIER.min_points_required) {
        //console.log('Checking the tier for silver for the point....', total_points)
        currentTier = SILVER_TIER.tier
        nextTier = GOLD_TIER.tier

        num_points_to_next_tier = GOLD_TIER.min_points_required - total_points
    }

    else if (total_points > BRONZE_TIER.min_points_required && total_points < SILVER_TIER.min_points_required) {
        //console.log('Checking the tier between silver and bronze for the point....', total_points)
        currentTier = BRONZE_TIER.tier
        nextTier = SILVER_TIER.tier

        num_points_to_next_tier = SILVER_TIER.min_points_required - total_points
    }

    else if (total_points === BRONZE_TIER.min_points_required) {
        // console.log('Checking the tier for bronze for the point....', total_points)
        currentTier = BRONZE_TIER.tier
        nextTier = SILVER_TIER.tier

        num_points_to_next_tier = SILVER_TIER.min_points_required - total_points
    }

    else if (total_points < BRONZE_TIER.min_points_required) {
        //  console.log('Checking the tier lower than bronze for the point....', total_points)
        nextTier = BRONZE_TIER.tier

        num_points_to_next_tier = BRONZE_TIER.min_points_required - total_points
    }

    else {
        throw new Error(`Opp.... Invalid points: ${total_points}`);
    }

    return [currentTier, num_points_to_next_tier]

}

module.exports = { calculateTier }
