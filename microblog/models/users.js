var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
}

module.exports = User;

User.prototype.save = function save(callback) {
  var user = {
    name: this.name,
    password: this.password,
  };

  mongodb.open(function(err, db) {

    if(err) {
      return callback(err);
    }

    db.collection('users', function(err, collection) {

      console.log('======collect users data, error:' + err);

      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.ensureIndex({'user.name': 1}, {unique: true});
      collection.insert({user, safe:true}, function(err, user) {
        console.log('======insert users data, error:' + err);
        mongodb.close();
        callback(err, user);
      });
    });
  });
};

User.get = function get(username, callback) {
  mongodb.open(function(err, db) {
    console.log('======read user document, error:' + err + ', username:' + username);

    if (err) {
      return callback(err);
    }

    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.findOne({'user.name': username}, function(err, doc) {

        console.log('======find one item from user document, error:' + err + ', doc:' + doc);

        mongodb.close();
        if (doc) {
          var user = new User(doc.user);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  })
};
