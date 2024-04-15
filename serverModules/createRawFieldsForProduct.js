module.exports = function createRawFields (newFields) {
    let fields = {}
    if(newFields[0] !== "") {
        fields = Object.fromEntries(
            newFields.map((fieldName, index) => [`field${[index]}`, 
                {"id": index ,"fieldName": fieldName, "fieldValue": ""}
            ])
            )
    }
return fields
}