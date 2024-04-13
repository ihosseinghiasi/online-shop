const bcrypt = require('bcryptjs')

module.exports = function updateAdmin (bodyDetails) {
    let userType = "admin"
                if(bodyDetails.department !== "مدیریت") {
                    userType = "support"
                }

    let myadmin = {
        firstName: bodyDetails.firstName,
        lastName: bodyDetails.lastName,
        password: bcrypt.hashSync(bodyDetails.password, 10),
        email: bodyDetails.email,
        department: bodyDetails.department,
        userType,
        isAdmin: "off",
        isCategory: "off",
        isUser: "off",
        isReport: "off",
        isTicket: "off",
        isEmail: "off",
        isProduct: "off",
        isCard: "off",
        isPayment: "off"
    }

    
    if(bodyDetails.isAdmin) {
        myadmin.isAdmin = "on"
    }
    if(bodyDetails.isCategory) {
        myadmin.isCategory = "on"
    }
    if(bodyDetails.isEmail) {
        myadmin.isEmail = "on"
    } 
    if(bodyDetails.isCard) {
        myadmin.isCard = "on"
    }
    if(bodyDetails.isProduct) {
        myadmin.isProduct = "on"
    }
    if(bodyDetails.isReport) {
        myadmin.isReport = "on"
    }
    if(bodyDetails.isUser) {
        myadmin.isUser = "on"
    }
    if(bodyDetails.isPayment) {
        myadmin.isPayment = "on"
    }
    if(bodyDetails.isTicket) {
        myadmin.isTicket = "on"
    }
return myadmin
}