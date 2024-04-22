module.exports = function getSellOfProducts (products) {
    let listOfProductsSell = []
    function productDetail(title) {
        this.title = title
        this.priceOfSell = 0 
        this.countOfSell = 0
    }
    Object.values(products).forEach(product => {
        listOfProductsSell.push(new productDetail(product.title))
    })
return listOfProductsSell
}