const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    amount : {
        type:Number,
        require:true
    },
    type: {
      type :String,
      enum : ["Credit" , "Debit"],
      required : true
    },
    date :{
     type: Date,
     default : Date.now
    },
    description:{
      type:String
    }
})

const AccountSchema = new Schema({
      balance:{
        type:Number,
        required:true,
        default : 0
      }
,
      user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
      },
      transactions : [TransactionSchema]
})
const Account = mongoose.model("Account" , AccountSchema);
module.exports = Account;