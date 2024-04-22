module.exports = function createFields (namesOfFields, cardFieldValues) {
                let fields = {}
                if(cardFieldValues[0] !== "") {
                    fields = Object.fromEntries(
                        namesOfFields.map((fieldName, index) => [`field${[index]}`, 
                            {"fieldName": fieldName, "fieldValue": cardFieldValues[index]}
                        ])
                        )
                }
return fields
}