module.exports = function getNewTickets (adminTickets) {
    console.log(adminTickets)
    let newTicketsNumber = 0
    Object.values(adminTickets).forEach(newTicket => {
        Object.values(newTicket).forEach(ticketsss => {
            Object.values(ticketsss).forEach(ticketss => {
                // console.log(ticketss)
                if(typeof(ticketss) === "number"){
                    newTicketsNumber+= ticketss
                }
            })
        })
    })
    return newTicketsNumber
}