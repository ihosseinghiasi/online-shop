const nodemailer = require('nodemailer')

module.exports = function emailSender (userName, userEmail, emailTemplate, fields = []) {

    let fieldsDetail = ""
    if(fields) {
        Object.values(fields).forEach(field => {
            fieldsDetail += field.fieldName + " : " + field.fieldValue + "<br>"
        })
    }
    
    const emailSubject = emailTemplate.title.replaceAll("%%site_title%%", " اکسپرس کارت ")
        .replaceAll("%%user_name%%", userName).replaceAll("%%sell_fields%%", fieldsDetail)
    const emailDescription = emailTemplate.description.replaceAll("%%user_name%%", userName)
        .replaceAll("%%site_title%%"," اکسپرس کارت ").replaceAll("%%sell_fields%%", fieldsDetail) 

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
    auth: {
        user: "expresscard.eshopping@gmail.com",
        pass: "akcu dhxm kuta lkql",
    },
    })

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"<اکسپرس کارت>" expresscard.eshopping@gmail.com ', // sender address
        to: userEmail, // list of receivers
        subject: emailSubject, // Subject line
        html: emailDescription, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error)

}