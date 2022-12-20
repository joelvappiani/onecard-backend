const mongoose = require('mongoose');


const transactionSchema = mongoose.Schema({
  
    qrId : {type: mongoose.Schema.Types.ObjectId, ref:'qrs'},
    userId : {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    date : Date,
    location : {
        lat: String,
        lon: String
    }

});

const Transaction = mongoose.model('transactions', transactionSchema);

module.exports = Transaction;