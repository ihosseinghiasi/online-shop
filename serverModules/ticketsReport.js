module.exports = function ticketsReport (adminTickets) {
    let recevedTicketsNumber = 0
    let sentTicketsNumber = 0 
    let newRecevedTicketsNumber = 0
    let newSentTicketsNumber = 0 
    let allTicketsNumber = 0 
    Object.values(adminTickets).forEach(newTicket => {
        recevedTicketsNumber += newTicket.adminTickets
        sentTicketsNumber += newTicket.userTickets
        newRecevedTicketsNumber += newTicket.newAdminTickets
        newSentTicketsNumber += newTicket.newUserTickets
        allTicketsNumber += newTicket.tickets
    })
    const ticketsReport = {
        recevedTicketsNumber,
        sentTicketsNumber,
        newRecevedTicketsNumber,
        newSentTicketsNumber,
        allTicketsNumber
    }
    return ticketsReport
}