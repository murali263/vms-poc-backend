const express = require('express');
const router = express.Router();
const Visitor = require('../model/vistors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer')
const GridFsStorage = require("multer-gridfs-storage");




router.post('/visitordatainsert', async (req, res) => {
  let verificationCode;
  crypto.randomInt(0, 10000, (err, n) => {
    if (err) throw err;
    verificationCode = n.toString().padStart(4, "0");
    req.body.verificationCode = verificationCode


  });

  Visitor.findOne({ mobile: req.body.mobile }, (err, visitor) => {


    if (err) {
      return res.status(500).json({ msg: err.message });
    }
    else if (visitor && !Object.keys(visitor).includes('checkout')) {
      return res.json({ success: false, message: 'mobile number is already existed with another pass ' })
    }
    else {
      visitor = new Visitor(req.body);
      visitor.save((err, visitor) => {
        if (err) {
          return res.json({ message: err.message });
        }
        else {
          return res.status(200).json({ success: true });
        }
      });
    }
  })
})
// -----------------------------visitor get -----------------------------//
router.get("/visitordataget", async (req, res) => {
  try {
    const vistget = await Visitor.find();
    res.status(200).json(vistget);
  } catch (error) {

  }
});
//--------------------------- visitor get with paginator  ---------------------------------------//

router.post("/visitorData", async (req, res) => {


  try {
    let pageSize = !isNaN(parseInt(req.body.pageSize))
      ? parseInt(req.body.pageSize)
      : 5;
    let pageIndex = !isNaN(parseInt(req.body.pageIndex))
      ? parseInt(req.body.pageIndex)
      : 0;



      let sortBy;
    if (req.body.visitType == "ALL") {
      sortBy = {}
    } else {
      sortBy = { 'visitType': req.body.visitType }
    }
    console.log("jvhdjhdghiu",req.body)

    
    const taskLists = await Visitor.aggregate([{
       $match: sortBy },
    {

      $facet: {
        data: [
          { $project: { _id: 0 } },
          { $sort: { created_on: -1 } },
          { $skip: pageIndex * pageSize },
          { $limit: pageSize },
        ],
        pagination: [{ $count: "total" }],
      },
    },
    ])

    res.status(200).json({
      status: 200,
      body: {
        success: true,
        responseData: taskLists[0].data,
        total: taskLists[0].pagination[0].total,
      },
    });

  } catch (error) {

  }
});


//---------------------------------------check in -----------------------------//

router.post("/check_in", async (req, res) => {
  try {
    otp = req.body.verificationCode

    mobile = req.body.mobile
    var d = new Date();
    let chcekinvisitor = d.toTimeString().split(" ")[0]
    data = await Visitor.find(
      {
        mobile: req.body.mobile
      });

    if (data != null) {

      if (data[0].verificationCode == otp) {

        x = await Visitor.findOneAndUpdate({ mobile: req.body.mobile }, { $set: { checkin: chcekinvisitor, checkout: "false" } })
        res.status(200).json({ message: 'updated', success: true });
      }
      else {
        res.status(400).json({ message: "enter valid otp" });
      }
    }

    //res.status(201).send({ status: 200, res: "updated" });
  } catch (error) {
    res.status(400).send(error);
  }
});

//--------------------------------------checkout-------------------------------------//

router.put("/check_out", async (req, res) => {
  try {
    var date = new Date();
    checkoutvisitor = date.toTimeString().split(" ")[0]
    let x = await Visitor.findOneAndUpdate(
      {
        $and: [
          { mobile: req.body.mobile },
          { checkout: "false" }
        ],
      },
      { $set: { checkout: checkoutvisitor } }
    );

    res.status(201).send({ status: 200, res: "updated", success: true });
  } catch (error) {
    res.status(400).send(error);
  }
});


//-------------------------------visitor get checkin -------------------------------//
router.get("/check_in_without_checkout", async (req, res) => {
  try {
    const checkin_vis = await Visitor.find({ checkout: "false" })

    res.status(200).json(checkin_vis, { success: true })
  }
  catch (err) {
    res.status(400).send(err);
  }
})
//-------------------------------type of visitor get -------------------------------//

router.get("/getTypeofvisitor", async (req, res) => {
  try {
    visitorlistObj = await Visitor.find({});
    visitorList = [];

    for (let visitorrole of visitorlistObj) {
      if (visitorrole["visitType"] == req.query.visitType) {
        visitorList.push(visitorrole);

      }
    }

    res.status(200).json({ res: visitorList, success: true });
  } catch (err) {
    console.log(err);
  }
});




module.exports = router;