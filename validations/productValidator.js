const validator = require('./validator')
const { checkSchema } = require('express-validator')
const path = require('path')

module.exports = new class productValidator extends validator {
    productHandle() {
        return checkSchema ({
            productName: { 
                isLength: { options: { min: 3 } },
                errorMessage: " نامک باید حداقل 3 کاراکتر باشد "
             },
             title: {
                isLength: { options: { min: 3 } },
                errorMessage: " عنوان دسته بندی باید حداقل  3 کاراکتر باشد "
            },
            description: {
                isLength: { options: { min: 10 } },
                errorMessage: " توضیحات باید حداقل 10 کاراکتر باشد "
            },
            price: {
                isDecimal: true,
                errorMessage: "  قیمت نمیتواند غیر عدد باشد "
            },
            price: {
                isLength: { options: { min: 1 } },
                errorMessage: " ورورد قیمت محصولات الزامی میباشد "
            },
            POT: {
                isDecimal: true,
                errorMessage: "  مدت اکانت نمیتواند غیر عدد باشد "
            },
            POT: {
                isLength: { options: { min: 1 } },
                errorMessage: "  ورورد مدت اکانت الزامی میباشد "
            },
            image: { 
                isLength: { options: { min: 1 } },
                errorMessage: " وجود عکس الزامی است "
             },
             image: {
                custom: { options: async value => {
                    if(!value) {
                        return
                    }
                    if(!['.jpg', '.jpeg', '.png'].includes(path.extname(value))) {
                        throw new Error(" نوع فایل انتخاب شده صحیح نمیباشد ")
                    }
                } }
             }
             
        })
    }
}