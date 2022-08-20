const mongoose = require('mongoose');
var VisitTypeSchema = mongoose.Schema({

    referValue:{
        type:String
    }
    
    


})
const Refer = mongoose.model('refer', ReferSchema);
module.exports = Refer