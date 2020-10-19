const mongoose = require('mongoose');

const mongodbErrorHandler = require('mongoose-mongodb-errors');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: Array, default: [] },
  usersDisliked: { type: Array, default: [] },
});

sauceSchema.methods.likeOrDislike = function(like, currentUserId) {
  const userIdInUsersLiked = this.usersLiked.find(userId => userId.equals(currentUserId));
  const userIdInUsersDisliked = this.usersDisliked.find(userId => userId.equals(currentUserId));

  if (!userIdInUsersLiked && like === 1) {
    this.likes += 1;
    this.usersLiked.push(currentUserId)

  } else if (!userIdInUsersLiked && like === -1) {
      this.dislikes += 1;
      this.usersDisliked.push(currentUserId)

    } else if (like === 0) {
      if (userIdInUsersLiked) {
        //si l'userId aimait le produit (likes 1), enlever le j'aime et enlever userId du tableau usersLiked
        this.usersLiked = this.usersLiked.filter(userId => !userId.equals(currentUserId))
        this.likes -= 1
      } else if (userIdInUsersDisliked) {
        //si l'userId n'aimait pas le produit (dislikes 1), enlever le je n'aime pas et enlever userId du tableau usersDisliked
          this.usersDisliked = this.usersDisliked.filter(userId => !userId.equals(currentUserId))
          this.dislikes -= 1
        }
    }
  }

sauceSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Sauce', sauceSchema);