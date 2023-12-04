module.exports = function getNewTickets (userTickets) {
    let newTicketsNumber = 0
    Object.values(userTickets).forEach(newTicket => {
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