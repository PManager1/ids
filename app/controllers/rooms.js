
/**
 * Module dependencies.  rooms controller
 */

var mongoose = require('mongoose')
  , Room = mongoose.model('Room')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User')

  Room.load(id, function (err, room) {
    if (err) return next(err)
    if (!room) return next(new Error('not found'))
    req.room = room
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  Room.list(options, function(err, rooms) {
    if (err) return res.render('500')
    Room.count().exec(function (err, count) {
      res.render('rooms/index', {
        title: 'Room/ housing for rent',
        rooms: rooms,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

/**
 * New room
 */

exports.new = function(req, res){
  res.render('rooms/new', {
    title: 'New room',
    room: new Room({})
  })
}

/**
 * Create an room
 */

exports.create = function (req, res) {
  var room = new Room(req.body)
  room.user = req.user

  room.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created Room !!!')
      return res.redirect('/rooms/'+room._id)
    }

    res.render('rooms/new', {
      title: 'New room',
      room: room,
      errors: utils.errors(err.errors || err)
    })
  })
}

/**
 * Edit an room
 */

exports.edit = function (req, res) {
  res.render('rooms/edit', {
    title: 'Edit ' + req.room.title,
    room: req.room
  })
}

/**
 * Update room
 */

exports.update = function(req, res){
  var room = req.room
  room = _.extend(room, req.body)

  room.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/rooms/' + room._id)
    }

    res.render('rooms/edit', {
      title: 'Edit room',
      room: room,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('rooms/show', {
    title: req.room.title,
    room: req.room
  })
}

/**
 * Delete an article
 */

exports.destroy = function(req, res){
  var room = req.room
  room.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/rooms')
  })
}
