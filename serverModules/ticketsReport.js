module.exports = function ticketsReport (adminTickets) {
    let recevedTicketsNumber = 0
    let sentTicketsNumber = 0 
    let allTicketsNumber = 0 
    Object.values(adminTickets).forEach(newTicket => {
        recevedTicketsNumber += newTicket.newAdminTickets
        console.log(recevedTicketsNumber)
        sentTicketsNumber += newTicket.newUserTickets
        allTicketsNumber += newTicket.tickets
    })
    const ticketsReport = {
        recevedTicketsNumber,
        sentTicketsNumber,
        allTicketsNumber
    }
    return ticketsReport
}