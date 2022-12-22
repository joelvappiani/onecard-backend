const express = require('express');
const router = express.Router();
// require ('../models/connections');
const cloudinary = require('cloudinary').v2;
const fs = require('fs')
const Setting = require('../models/settings')
const User = require('../models/users')
// const uniqid = require('uniqid')
const streamifier = require('streamifier')


cloudinary.config({
    cloud_name: 'donexpiib',
    api_key: '156348792415538',
    api_secret: 'kNreRjRl8kG3xVOOV7thVvwb38A'
})


//Gather all the infos of the user sending his id
router.get('/:userId', async(req, res)=> {
    try {
        const { userId } = req.params
        const foundUser = await User.findById(userId).populate('userSettings')
        const { firstName, lastName, email, photo, cover, userSettings } = foundUser
        res.json({
            result: true,
            user: {firstName, lastName, email, photo, cover, userSettings}
        })
    } catch(error) {
        console.log(error)
        res.json({result: false, message: 'Error'})
    }
})

// Modify required infos of the profile
router.put('/required', async(req, res)=> {
    try {
        const { userId, valueToUpdate, newValue } = req.body
        if (!userId || !valueToUpdate || !newValue){
            res.json({result: false, message: 'Missing values'})
            return
        }
        await User.findByIdAndUpdate(userId, {[valueToUpdate]: newValue})
        res.json({
            result: true,
            message: 'User info updated successfully'
        })
    } catch(error) {
        console.log(error)
        res.json({result: false, message: 'Error'})
    }
})


//Modifiy settings infos 
router.put('/userSettings/value', async(req, res)=> {
    try {
        const { userId, valueToUpdate, newValue } = req.body
        if (!userId || !valueToUpdate || !newValue){
            res.json({result: false, message: 'Missing values'})
            return
        }
        const user = await User.findById(userId)
        const settingsId = user.userSettings
        if(newValue){
            const settings = await Setting.findById(settingsId)
            const switchOn = settings[valueToUpdate].switchOn
            await Setting.findByIdAndUpdate(settingsId, {[valueToUpdate]: {value: newValue, switchOn}})
        
        
        res.json({
            result: true,
            message: 'User info updated successfully'
        })
    }
    } catch(error) {
        console.log(error)
        res.json({result: false, message: 'Error'})
    }
})

//Modify settings switch
router.put('/userSettings/switch', async(req, res)=> {
    try {
        const { userId, valueToUpdate, newValue } = req.body
        if (!userId || !valueToUpdate || !newValue){
            res.json({result: false, message: 'Missing values'})
            return
        }
        const user = await User.findById(userId)
        const settingsId = user.userSettings
        if(newValue){
            console.log(valueToUpdate)
            const settings = await Setting.findById(settingsId)
            const value = settings[valueToUpdate].value
            await Setting.findByIdAndUpdate(settingsId, {[valueToUpdate]: {value, switchOn: newValue}})
        } 
        res.json({
            result: true,
            message: 'User info updated successfully'
        })
   
    } catch(error) {
        console.log(error)
        res.json({result: false, message: 'Error'})
    }
})


//Add a new custom info 
router.post('/customs', async(req, res)=> {
    try {
        const { switchOn, userId, name, url, icon } = req.body
        const user = await User.findById(userId)
        const settingsId = user.userSettings
        const settingsDocument = await Setting.findById(settingsId)
        const userCustoms = settingsDocument.customs
        const newCustomArray = [...userCustoms, {switchOn, name, url, icon}]
        await Setting.findByIdAndUpdate(settingsId, {customs : newCustomArray})
        res.json({result: true})
    } catch(error) {
        console.log(error)
        res.json({result: false, message: 'Error'})
    }
})

//Remove a custom info
router.delete('/customs', async(req, res)=> {
    try {
        const { userId, url } = req.body
        const user = await User.findById(userId)
        const settingsId = user.userSettings
        const settingsDocument = await Setting.findById(settingsId)
        const userCustoms = settingsDocument.customs
        if (userId && url){
            const newCustomArray = userCustoms.filter((e)=> e.url !== url)
            await Setting.findByIdAndUpdate(settingsId, {customs : newCustomArray})
            res.json({result: true})
        } else {
            res.json({result: false, message: 'Missing information'})
        }
    } catch(error) {
        console.log(error)
        res.json({result: false, message: 'Error'})
    }
})

//Switch a custom info 
router.put('/customs', async(req, res)=> {
    try {
        const { userId, url, switchOn } = req.body

        const user = await User.findById(userId)
        const settingsId = user.userSettings
        const settingsDocument = await Setting.findById(settingsId)
        const userCustoms = settingsDocument.customs
      
        if (userId && url){
            console.log(userCustoms)
            const newCustomArray = userCustoms.map((e)=> {
                if(e.url === url){
                   return {_id: e._id, name: e.name, url: e.url, icon: e.icon, switchOn}
                } else {
                    return e
                }
            })
            
            const customs = await Setting.findByIdAndUpdate(settingsId, {customs : newCustomArray})
            res.json({result: true, customs})
        } else {
            res.json({result: false, message: 'Missing information'})
        }
    } catch(error) {
        console.log(error)
        res.json({result: false, message: 'Error'})
    }
})

//Upload a cover image 
router.post('/cover/:userId', async(req, res)=> {
    try{
        const {userId} = req.params

        const imageData = [];

        req.on('data', data => {
          imageData.push(data);
        });
      
        req.on('end', () => {
            const imageBuffer = Buffer.concat(imageData);

            cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                async (error, result) => {
                    if (error) {
                        console.error(error);
                        res.status(500).send(error);
                    } else {
                        console.log(result);
                        await User.findByIdAndUpdate(userId, {cover: result.secure_url})
                        res.send(result);
                    }
                }
            ).end(imageBuffer);
        });
    } catch(error){
        res.json({result: false, message: 'message'})
    }
})

router.post('/photo/:userId', async(req, res)=> {
    try{
        const {userId} = req.params

        const imageData = [];

        req.on('data', data => {
          imageData.push(data);
        });
      
        req.on('end', () => {
            const imageBuffer = Buffer.concat(imageData);

            cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                async (error, result) => {
                    if (error) {
                        console.error(error);
                        res.status(500).send(error);
                    } else {
                        console.log(result);
                        await User.findByIdAndUpdate(userId, {photo: result.secure_url})
                        res.send(result);
                    }
                }
            ).end(imageBuffer);
        });
    } catch(error){
        res.json({result: false, message: 'message'})
    }
})

module.exports = router


