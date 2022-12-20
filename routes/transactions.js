const express = require('express');
const router = express.Router();
require ('../models/connections');
const Transaction = require('../models/transactions')

//Add a contact to the list on the scan
router.post('/', async (req, res)=> {
    try {
        const { qrId, userId, lat, lon,} = req.body
        const date = new Date()
        await new Transaction({qrId, userId, date, location:{lat, lon}}).save()
        res.json({result: true, message: 'New transaction created'})
    } catch(error) {
     console.log(error)
     res.json({result: false, message: 'Error'})
    }
})

//Show contact list to a user
router.get('/:userId', async(req, res)=> {
    try {
        const { userId } = req.params
        const contacts = await Transaction.find({userId}).populate(
            {
                path: 'userId',
                model: 'users',
                select: { 'firstName': 1,'lastName':1}
            },   
        ).populate(
            {
                path: 'qrId',
                model: 'qrs',
                select: { 'qrName': 1}
            }
        )
        res.json({result: true, contacts})
    } catch(error) {
     console.log(error)
     res.json({result: false, message: 'Error'})
    }
})

//Delete a contact in some user contact list
router.delete('/', async(req, res)=> {
    try {
        const { userId, qrId } = req.body
        const contacts = await Transaction.find({userId})
        const contactToDelete = contacts.find(e => e.qrId == qrId)
        if (contactToDelete){
            const id = contactToDelete._id
            await Transaction.findByIdAndDelete(id)
            res.json({result: true, message: 'You successfully deleted a contact', contactToDelete})
        } else {
            res.json({result: false, message: 'Contact not found cannot perform deletion'})
        }

    } catch(error) {
     console.log(error)
     res.json({result: false, message: 'Error'})
    }
})

module.exports = router




