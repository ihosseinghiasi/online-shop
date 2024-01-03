const controller = require('../controller')
const persianDate = require('date/persianDate')
const Email = require('models/email')
const EmailTemplate = require('models/emailTemplate')
const Ticket = require('models/ticket')
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')
const ticketsReport = require('serverModules/ticketsReport')


module.exports = new class emailController extends controller {

    async addNewEmail(req, res, next) {
        try {
            // const errors = validationResult(req)
            // if(!errors.isEmpty()) {
            //     let myErrors = errors.array()
            //     req.flash('errors', myErrors)
            //     return res.redirect('/admin-cPanel/category/newCategory')
            // }
            
            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                // errors: req.flash('errors')
           }

            // const tagIgnore = /(<([^>]+)>)/g
            // let emailDescription = req.body.description
            // const description = emailDescription.replace(tagIgnore,"")
            const newEmailTemplate = new EmailTemplate({
                title: req.body.title,
                description: req.body.description
            }) 

            await newEmailTemplate.save()
            return res.redirect('/admin-cPanel/email/newEmail')
        } catch (err) {
            next(err)
        }
}

    async newEmail(req, res, next) {
        try {

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                errors: req.flash('errors')
           }
            return res.render('admin/emailRegister')
        } catch (err) {
            next(err)
        }
    }

    async showEmails(req, res, next) {

        try {
            const emails = await Email.find({})

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                emails,
           }          
           return res.render('admin/showEmails')
        } catch (err) {
            next(err)
        }
    }

    async showEmailTemplates(req, res, next) {

        try {
            const emailTemplates = await EmailTemplate.find({})

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            //nodemailer

            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
            auth: {
                user: "expresscard.eshopping@gmail.com",
                pass: "akcu dhxm kuta lkql",
            },
            })

            // async..await is not allowed in global scope, must use a wrapper
            async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: '<expresscard.eshopping@gmail.com>', // sender address
                to: "hossein.ghiasi.info@gmail.com", // list of receivers
                subject: "ExpressCard", // Subject line
                text: "hello Hossein ghiasi", // plain text body
                html: "<b>Hello Hossein Ghiasi</b>", // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
            }

            main().catch(console.error)


            //end nodemailer

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                emailTemplates,
           }          
           return res.render('admin/showEmailTemplates')
        } catch (err) {
            next(err)
        }
    }

    async showEmailTemplate(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const emailTemplate = await EmailTemplate.findOne({ _id: id })

            const userID = req.user.id
            const adminDepartment = req.user.department
            const userTickets = await Ticket.find({ $or: [{ user: userID }, { targetDepartment: adminDepartment }]})
            const ticketNumber = ticketsReport(userTickets)
            const recevedTicketsNumber = ticketNumber.recevedTicketsNumber
            const sentTicketsNumber = ticketNumber.sentTicketsNumber
            const allTicketsNumber = ticketNumber.allTicketsNumber

            const newEmail = new Email ({
                title: "dsgjgjfgfjgjf",
                description: "dhgjfgjgfjgfdjfgdjfdfjgfdjgfdjfdgjfgfdjgfdjgfd11111",
                emailTarget: "hosseinghiasi.info@gmail.com"
            })

            await newEmail.save()

            res.locals = {
                persianDate,
                recevedTicketsNumber,
                sentTicketsNumber,
                allTicketsNumber,
                emailTemplate,
                errors: req.flash('errors') 
            }
            res.render('admin/showEmailTemplate')
        } catch (err) {
            next(err)
        }
    }

    async updateCategory(req, res, next) {
        try {
            res.locals = {
                persianDate,
            }

            const id = (req.params.id).trim()

           const errors = validationResult(req)
           if(!errors.isEmpty()) {
               let myErrors = errors.array()
               req.flash('errors', myErrors)
               return res.redirect(`/admin-cPanel/category/editCategory/${id}`)
            }

            const m = await Category.findOne({ _id: id })
            const data = {
                categoryName: req.body.categoryName,
                title: req.body.title,
                description: req.body.description
            }
            if(req.file) {
                data.image = req.file.path.replace(/\\/g, '/').substring(6)
            } else {
                data.image = m.image
            }
            let category = await Category.updateOne({ _id: id }, { $set: data })
            return res.redirect('/admin-cPanel/category/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async deleteCategory(req, res, next) {
        try {
            res.locals = {
                persianDate,
           }
            const id = (req.params.id).trim()
            const category = await Category.deleteOne({ _id: id })
            return res.redirect('/admin-cPanel/category/showCategories')
        } catch (err) {
            next(err)
        }
    }

    async categoryPage(req, res, next) {
        try {
            const id = (req.params.id).trim()
            const category = await Category.findOne({ _id: id })
            const products = await Product.find({ categoryTitle: category.title })
            const categories = await Category.find({})
            let userStatus = "quest" 
            if(req.isAuthenticated()) {
                userStatus = "user"
            }
            res.locals = {
                products,
                category,
                categories,
                userStatus,
                user: req.user
            }
            res.render('shop/category')
        } catch (err) {
            next(err)
        }
    }
}