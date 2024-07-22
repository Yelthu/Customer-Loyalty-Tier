const { min_order_length, max_order_length, min_promotion_length, max_promotion_length } = require('./constant')

const point_multiplier_min_order_item = 1.25 // For Min Order Item Quantity Promotion
const point_multiplier_min_order_total = 1.5 // Min Order Total Promotion
const point_multiplier_item_category = 1.1 //Item Category Promotion
const point_multiplier_order_day = 1.1 // Order Day of Purchase Promotion

var total_points = 0 // Total points for the customer


/* Input : Expected Input Array from the client side (Order & Promotion) */
/* Output : Json formatted object for the client side  */

/* Add-on : The Function Will Be Used For The Minipulation Of Customer Loyaty Tier  */
/* Reason : The Customer Loyaty Tire Is Depending On The Rewards How Much They Earned  */
const calculateRewards = (ordersList) => {
    //console.log('Arrived for Rewards')

    var orders = ordersList.orders
    var promotions = ordersList.promotions
    var order_summaries = []
    var rewardsOutput

    if (orders.length >= min_order_length && orders.length <= max_order_length) {

        for (var i = 0; i < orders.length; i++) {

            var order_summary = checkingPromotion(promotions, orders[i])

            order_summaries.push(order_summary)
        }

        rewardsOutput = prepareRewardResponse(total_points, order_summaries)
        total_points = 0 //Reset Total Points(To Prevent Duplicate Amount When Hits More Than One For Same Customer)

    }

    return rewardsOutput
}

/* Input : Expected Input Array & Total Point for the customer */
/* Output : Json formatted array for the client side  */
function prepareRewardResponse(total_points, order_summaries) {

    var trunc_total_point = Math.trunc(total_points) //Extract full number (integer)

    const responseRewards = {
        total_points: trunc_total_point,
        order_summaries: order_summaries
    }

    return JSON.stringify(responseRewards)

}

/* Input : Expected Input Arrays for (Order & Promotion) */
/* Output : Order Summaries Array  */
function checkingPromotion(promotionList, order) {
    //console.log('Inside Promotion Checking.......')

    var min_order_qauntity_promo_rewards = 0
    var order_total_promo_rewards = 0
    var item_category_promo_rewards = 0
    var order_day_purchase_promo_rewards = 0

    var effective_promotion_id = ''
    var eligible_promotion_ids = []
    var points_earned = 0

    var order_summaries

    var promo_length = promotionList.length

    if (promo_length >= min_promotion_length && promo_length <= max_promotion_length) {

        for (var p = 0; p < promo_length; p++) {
   
            var promotion = promotionList[p]
            var config = promotion.config

            if (promotion.name === 'Min Order Item Quantity Promotion') {
                //console.log('Min Order Item Quantity Promotion ')

                //console.log('Min Order Item Quantity Promotion Config ', config.min_order_item_quantity)
                //console.log('Min Order Item Quantity Promotion Config', config.type)

                if (order.items.length >= config.min_order_item_quantity) {
                    // console.log('This order is eligible with no of item ', order.items.length)

                    let totalPrice = getTotal(order.items)

                    min_order_qauntity_promo_rewards = totalPrice * point_multiplier_min_order_item

                    total_points += min_order_qauntity_promo_rewards

                    points_earned = min_order_qauntity_promo_rewards
                    effective_promotion_id = promotion._id

                    //console.log('Rewards Point ${order.items.price_usd} * ${point_multiplier_min_order_item}', min_order_qauntity_promo_rewards)

                }
            }

            if (promotion.name === 'Min Order Total Promotion') {
                // console.log('Min Order Total Promotion')

                //console.log('Min Order Total Promotion Config ', config.min_order_total_price_usd)
                //console.log('Min Order Total Promotion Config', config.type)

                let totalPrice = getTotal(order.items)

                if (totalPrice >= config.min_order_total_price_usd) {
                    //console.log('This order is eligible with total price ', totalPrice)

                    order_total_promo_rewards = totalPrice * point_multiplier_min_order_total

                    total_points += order_total_promo_rewards

                    //console.log('Rewards Point ${order.items.price_usd} * ${point_multiplier_min_order_total}', order_total_promo_rewards)

                    points_earned = comapareRewardsPoints(min_order_qauntity_promo_rewards, order_total_promo_rewards, item_category_promo_rewards, order_day_purchase_promo_rewards)

                    if (points_earned === order_total_promo_rewards) {
                        points_earned = order_total_promo_rewards
                        effective_promotion_id = promotion._id
                    }
                }

            }

            if (promotion.name === 'Item Category Promotion') {
                //console.log('Item Category Promotion ')

                //console.log('Item Category Promotion Config ', config.item_category)
                //console.log('Item Category Promotion Config', config.type)

                let order_item = order.items

                const foundCategory = order_item.find((item) => {
                    return item.category === config.item_category
                })

                if (foundCategory !== null && foundCategory !== undefined) {
                    //console.log('This order is eligible with category ', foundCategory)

                    item_category_promo_rewards = foundCategory.price_usd * point_multiplier_item_category

                    total_points += item_category_promo_rewards

                    //console.log('Rewards Point ${order.items.price_usd} * ${point_multiplier_item_category}', item_category_promo_rewards)

                    points_earned = comapareRewardsPoints(min_order_qauntity_promo_rewards, order_total_promo_rewards, item_category_promo_rewards, order_day_purchase_promo_rewards)

                    if (points_earned === item_category_promo_rewards) {
                        points_earned = item_category_promo_rewards
                        effective_promotion_id = promotion._id
                    }

                }

            }

            if (promotion.name === 'Order Day of Purchase Promotion') {
                //console.log('Order Day of Purchase Promotion')

                //console.log('Order Day of Purchase Promotion Config ', config.day)
                //console.log('Order Day of Purchase Promotion Config', config.type)

                let day_no = checkingDayName(order.date)

                let totalPrice = getTotal(order.items)

                if (day_no === config.day) {
                    //console.log('This order is eligible with category ', day_no)

                    order_day_purchase_promo_rewards = totalPrice * point_multiplier_order_day

                    total_points += order_day_purchase_promo_rewards

                    //console.log('Rewards Point ${totalPrice} * ${point_multiplier_order_day}', order_day_purchase_promo_rewards)

                    points_earned = comapareRewardsPoints(min_order_qauntity_promo_rewards, order_total_promo_rewards, item_category_promo_rewards, order_day_purchase_promo_rewards)

                    if (points_earned === order_day_purchase_promo_rewards) {
                        points_earned = order_day_purchase_promo_rewards
                        effective_promotion_id = promotion._id
                    }

                }

            }

        }

        eligible_promotion_ids.push(effective_promotion_id)

        order_summaries = {
            order_id: order._id,
            eligible_promotion_ids: eligible_promotion_ids,
            effective_promotion_id: effective_promotion_id,
            points_earned: Math.trunc(points_earned)
        }

    }

    return order_summaries
}

/* Input : Expected Input Number For Each Rewards Promotion */
/* Output : Maximum Rewards Promotion Points */
function comapareRewardsPoints(min_order_qauntity_promo_rewards, order_total_promo_rewards, item_category_promo_rewards, order_day_purchase_promo_rewards) {
    const max_reward_point_earned = Math.max(min_order_qauntity_promo_rewards, order_total_promo_rewards, item_category_promo_rewards, order_day_purchase_promo_rewards)

    return max_reward_point_earned
}

/* Input : Expected Input Array Order Items */
/* Output : Total prices */
function getTotal(items) {

    var order_item = items

    const totalPrice = order_item.reduce((currentTotal, item) => {
        return item.price_usd + currentTotal
    }, 0)

    return totalPrice
}

/* Input : Expected Input Order Date */
/* Output : Return Day Number [0 for Monday to 6 for Saturday] etc */
function checkingDayName(orderDate) {

    var custom_date = new Date(orderDate.year, orderDate.month, orderDate.date)
    var day_number

    const options = { weekday: 'long' };
    const formatter = new Intl.DateTimeFormat('en-US', options);

    const dayName = formatter.format(custom_date);

    switch (dayName) {
        case 'Sunday':
            day_number = 0
            break;

        case 'Monday':
            day_number = 1
            break;

        case 'Tuesday':
            day_number = 2
            break;

        case 'Wednesday':
            day_number = 3
            break;

        case 'Thursday':
            day_number = 4
            break;

        case 'Friday':
            day_number = 5
            break;

        case 'Saturday':
            day_number = 6
            break;

        default:
            throw new Error(`Invalid day name: ${dayName}`);
    }

    return day_number

}


module.exports = { calculateRewards }