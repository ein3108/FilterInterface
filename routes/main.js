'use strict';

module.exports = function(io, db) {
	var express = require('express');
	var router = express.Router();

	router.get('/', (req, res, next) => {
		return res.status(200).render("main", {title: "Expert Grading"});
	});

	router.post('/', (req, res, next) => {
		var body = req.body;
	});

	return router;
}