module.exports = function getProductSellReport (payments, listOfProductsSell) {
    let totalSell = {
        totalPriceOfSell : 0,
        totalCountOfSell : 0
    }
    Object.values(payments).forEach(total => {
        Object.values(total).forEach(payment => {
           if(payment.payment === true ||  payment.payment === false) {
                totalSell.totalPriceOfSell += payment.totalPrice
                totalSell.totalCountOfSell += payment.count
                Object.values(listOfProductsSell).forEach(productValues => {
                    if(productValues.title === payment.title) {
                        productValues.priceOfSell += payment.totalPrice
                        productValues.countOfSell += payment.count
                    }
                })          
           }
        })
    })
return totalSell
}