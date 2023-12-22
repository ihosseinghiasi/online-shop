module.exports = function newTickets (tickets) {
    Object.values(tickets).forEach(allTickets => {
        if(allTickets.newUserTickets !== 0) {
           Object.values(allTickets).forEach(same => {
            Object.values(same).forEach(s => {
                Object.values(s).forEach(a => {
                    if(typeof(a) === "object") {
                        Object.values(a).forEach(b => {
                            if(typeof(b) === "string") {
                                console.log(b)
                            }
                        })
                    }
                })
            })
        })
        }
    })
}