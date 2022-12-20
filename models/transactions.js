const mongoose = require('mongoose');

<<<<<<< HEAD
=======
const locationSchema = mongoose.Schema({
    lat: Number,
    lon: Number
})

>>>>>>> 582721d9f7d5f7370d606bcecf4e1de1556fe9b6

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