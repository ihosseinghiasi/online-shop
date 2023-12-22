module.exports = function getNewTickets (adminTickets) {
    let newTicketsNumber = 0
    Object.values(adminTickets).forEach(newTicket => {
        Object.values(newTicket).forEach(ticketsss => {
            Object.values(ticketsss).forEach(ticketss => {
                if(typeof(ticketss) === "number"){
                    newTicketsNumber+= ticketss
                }
            })
        })
    })
    return newTicketsNumber
}