import { createError } from "../error.js"
import Video from "../models/Video.js"

export const addVideo = async (req, res, next) => {
   const newVideo = new Video({userId: req.user.id, ...req.body})
   try {
      const savedVideo = await newVideo.save()
      res.status(200).json(savedVideo)
   } catch (error) {
      next(error)
   }
}

export const updateVideo = async (req, res, next) => {
   try {
      const video = await Video.findById(req.params.id)
      if(!video) return next(createError(404, "Video not found"))

      if(req.user.id === video.userId) {
         const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
            $set: req.body
         }, {new: true})

         res.status(200).json(updatedVideo)
      }
      else {
         next(createError(403, "You do not have permission to update this video"))
      }
   } catch (error) {
      next(error)
   }
}

export const deleteVideo = async (req, res, next) => {
   try {
      const video = await Video.findById(req.params.id)
      if(!video) return next(createError(404, "Video not found"))

      if(req.user.id === video.userId) {
         await Video.findByIdAndDelete(req.params.id)

         res.status(200).json("Video has been deleted")
      }
      else {
         next(createError(403, "You do not have permission to delete this video"))
      }
   } catch (error) {
      next(error)
   }
}

export const getVideo = async (req, res, next) => {
   try {
      const video = await Video.findById(req.params.id)
      res.status(200).json(video)
   } catch (error) {
      next(error)
   }
}

export const addView = async (req, res, next) => {
   try {
      await Video.findByIdAndUpdate(req.params.id, {
         $inc: {views: 1}
      })
      res.status(200).json("The views has been increased")
   } catch (error) {
      next(error)
   }
}

export const random = async (req, res, next) => {
   try {
      const videos = await Video.aggregate([{$sample: {size: 40}}])
      res.status(200).json(videos)
   } catch (error) {
      next(error)
   }
}

export const trend = async (req, res, next) => {
   try {
      const videos = await Video.find().sort({ views: -1 })
      res.status(200).json(videos)
   } catch (error) {
      next(error)
   }
}

export const sub = async (req, res, next) => {
   try {
      const user = await User.findById(req.user.id)
      const subscribedChannels = user.subscribedUsers;

      const list = Promise.all(
         subscribedChannels.map(channelId => {
            return Video.find({user: channelId})
         })
      )

      res.status(200).json(list)
   } catch (error) {
      next(error)
   }
}