const router = require("express").Router();

router.get("/", (req,res)=> {
    res.send("hey user")
})

module.exports = router