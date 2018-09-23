const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  googleID: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  telephone: {
    type: String,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  Dateofbirth: {
    type: String,
  },
});

//Create collection and add schema
mongoose.model('users',UserSchema);

// bcrypt middleware
UserSchema.pre('save', function(next){
  var user = this;

  //check if password is modified, else no need to do anything
  if (!user.isModified('pass')) {
     return next()
  }

  user.pass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  next()
})