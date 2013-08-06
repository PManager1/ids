
/**
 * Module dependencies.  apt controllers
 */

var mongoose = require('mongoose')
  , Apartment = mongoose.model('Apartment')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User')

  Apartment.load(id, function (err, Apartment) {
    if (err) return next(err)
    if (!Apartment) return next(new Error('not found'))
    req.Apartment = Apartment
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

  Apartment.list(options, function(err, apartments) {
    if (err) return res.render('500')
    Apartment.count().exec(function (err, count) {
      res.render('Apartments/index', {
        title: 'Apartments/ housing for rent',
        apartments: apartments,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

