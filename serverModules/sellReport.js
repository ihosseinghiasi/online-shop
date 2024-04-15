module.exports = function getProductSellReport (payment, listOfProductsSell) {
    let totalPriceOfSell = 0
            Object.values(payment).forEach(total => {
                Object.values(total).forEach(payment => {
                   if(payment.payment === true ||  payment.payment === false) {
                        totalPriceOfSell += payment.totalPrice
                        Object.values(listOfProductsSell).forEach(productValues => {
                            if(productValues.title === payment.title) {
                                productValues.priceOfSell += payment.totalPrice
                            }
                        })          
                   }
                })
            })
return totalPriceOfSell
}