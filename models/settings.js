const mongoose = require('mongoose');

const customSchema = mongoose.Schema({
    name : String,
    url : String,
    icon : String,
    switchOn: Boolean
})

const settingSchema = mongoose.Schema({
    phoneNumber : {
        value: String,
        switchOn: Boolean
    },
    address : {
        value: String,
        switchOn: Boolean
    },
    companyName : {
        value: String,
        switchOn: Boolean
    },
    website : {
        value: String,
        switchOn: Boolean
    },
    linkedin : {
        value: String,
        switchOn: Boolean
    },
    
    customs : [customSchema]
});

const Setting = mongoose.model('settings', settingSchema);

module.exports = Setting;