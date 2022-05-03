const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { response } = require("express");

router.put("/:id", async(req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has updated")
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only update your account!");
    }
});

router.delete("/:id", async(req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only delete your account!");
    }
});

router.get("/:id", async (req, res)=> {
    try{
        const user =  await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch(err){
        res.status(500).json(err);
    }
});

router.put("/:id/follow", async (req,res) => {
    if(req,body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers:req.body.userId} });
                await currentUser.updateOne({$push: {followings:req.body.userId} });
                res.status(200).json("you have followed user");
            } else {
                res.status(403).json("Already follow user")
            }

        }
        catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("Can only follow other users")
    }
});

router.put("/:id/unfollow", async (req,res) => {
    if(req,body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers:req.body.userId} });
                await currentUser.updateOne({$pull: {followings:req.body.userId} });
                res.status(200).json("you have unfollowed user");
            } else {
                res.status(403).json("Already unfollowed user")
            }

        }
        catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("You can not unfollow yourself")
    }
})


module.exports = router