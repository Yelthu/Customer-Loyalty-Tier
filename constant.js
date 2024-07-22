/* The file for defining the constand variables for the sever side */

const min_order_length = 0
const max_order_length = 1000
const min_promotion_length = 0
const max_promotion_length = 100

const BRONZE_TIER = {
    tier: 'bronze',
    min_points_required: 50,
};

const SILVER_TIER = {
    tier: 'silver',
    min_points_required: 100,
};

const GOLD_TIER = {
    tier: 'gold',
    min_points_required: 150,
};

const AFTER_GOLD_TIER = {
    tier: 'none',
    min_points_required: null,
};


module.exports = {
    min_order_length, max_order_length, min_promotion_length, max_promotion_length,
    BRONZE_TIER, SILVER_TIER, GOLD_TIER, AFTER_GOLD_TIER
}