'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = mongoose.Schema({
    title: String,
    message: {type: String, required: true},
    reply: {type: Schema.Types.ObjectId, ref: 'posts'},
    head: {type: Schema.Types.ObjectId, ref: 'posts', required: true},
    //user: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    updated: {type: Date, default: Date.now}
  });

module.exports = mongoose.model('posts', postSchema);
