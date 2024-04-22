module.exports = function getNamesOfFields (productFields) {
    const pureFields = productFields.fields
    let namesOfFields = []
    if(pureFields) {
        const fieldsName = Object.values(pureFields)
        for (const value of Object.values(fieldsName)) {
            for (let v in value) {
                if(v === "fieldName") {
                    namesOfFields.push(value[v])
                }
            }
        }
    }

return namesOfFields
}