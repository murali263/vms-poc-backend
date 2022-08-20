const express = require("express");
const router = express.Router();
const refer = require("../model/refer")
router.post("/referData", async (req, res) => {
    try {
      const data = new refer(req.body);
      const result = await data.save();
      res.status(200).json({ success: true, result: result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false });
    }
  });

  router.get("/referget", async (req, res) => {
    try {
      const referget = await refer.find();
      res.status(200).json(referget);
    } catch (error) {
  
    }
  });

module.exports = router;