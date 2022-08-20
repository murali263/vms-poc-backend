const mongoose = require('mongoose');
var visitorSchema = mongoose.Schema({

    visitor_name:{
        type:String
    },
    mobile: {
        type: Number
    },
    members: {
        type: Array
    },
    memberscount:{
        type:String
            },
    
    vehicle_number: {
        type: String
    },
    visit_date: {
        type: String
    },
    visit_time: {
        type: String
    }, 
    email: {
        type: String
    },
    refer_to:{
        type:String
    },
    visitType: {
        type: String,
        enum: ["GeneralVisitor","Vendor", "EventOrganizer", "Laborer"],

    },
    comments:{
        type:String
    },
    physical_pass:{
        type:Boolean
    },
    CompanyName:{
        type:String
    },
   
    Role:{
        type:String
    },
    EventType:{
        type:String
    },
    FromDate:{
        type:String
    },
    ToDate:{
        type:String
    },
    created_on: {
        type: String,
        default: Date.now()
    },
    checkin: {
        type: String,
        // default:null
    },
    checkout: {
        type: String,
        //  default:null
    },   
    verificationCode: {
        type: String
    }, 
    visiting_from: {
        type: String
    },
   
    refer_to: {
        type: String

    },
    files:{
        type: String
    }
})

const visitor = mongoose.model('visitor', visitorSchema);
module.exports = visitor