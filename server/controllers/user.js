import { createError } from "../error.js"
import User from "../models/User.js";
import Video from '../models/Video.js'

export const update = async (req ,res, next) => {
    if(req.params.id === req.user.id)       //params.id is the id from user.js file(:id) and user.id is jwt user id
      {
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{        //await for request then json
                $set: req.body
            },
            { new : true} )    //set the newest value of the 
            //const {password, ...others} = updatedUser._doc
            res.status(200).json(updatedUser) 
        }catch(err) {
          next(err)
        }
      }else {
        return next(createError(403, "You can update only your account"));
      }
}

export const deleteUser = async (req ,res, next) => {
  if(req.params.id === req.user.id)     
      {
        try{
            await User.findByIdAndDelete(req.params.id)  ;
            res.status(200).json("the user has been deleted!") ; 
        }catch(err) {
          next(err)
        }
      }else {
        return next(createError(403, "You can delete only your account!"));
      }
}

export const getUser = async (req ,res, next) => {
  try{
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  }catch(err){
    next(err);
  }
}

export const subscribe = async (req ,res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {                //user id
      $push: {subscribedUsers: req.params.id}        //subscribed channels id
    })
    await User.findByIdAndUpdate(req.params.id,{
      $inc: {subscribers: 1}
    })
    res.status(200).json("Subscription successful!");
  }
  catch(err)
  {
    next(err);
  }
}

export const unsubscribe = async (req ,res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {                //user id
      $pull: {subscribedUsers: req.params.id}        //subscribed channels id
    })
    await User.findByIdAndUpdate(req.params.id,{
      $inc: {subscribers: -1}
    })
    res.status(200).json("Unsubscription successful!");
  }
  catch(err)
  {
    next(err);
  }
}

export const like = async (req ,res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId,{
      $addToSet:{likes:id},
      $pull:{dislikes:id}
    })
    res.status(200).json("The video has been liked.")
  } catch (err) {
    next(err);
  }
}

export const dislike = async (req ,res, next) => {             //this method add the userId to the dislikes array of the video
  const id = req.user.id;
    const videoId = req.params.videoId;
    try {
      await Video.findByIdAndUpdate(videoId,{
        $addToSet:{dislikes:id},                    //$addToSet method ensures the the userId is added just once unlike $push method
        $pull:{likes:id}                            //user is pulled from likes and added to dislikes
      })
      res.status(200).json("The video has been disliked.")
  } catch (err) {
    next(err);
  }
}

