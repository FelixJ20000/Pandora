var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var vocabQuizList = require("./index.dust");
var vocabQuizPage = require("./quiz.dust");
var uu = require("underscore");

module.exports.index = function(req, res) {
    Subject.findById(req.param("subject")).populate("teacher").exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(vocabQuizList, {subject: doc, quizzes: doc.vocab_quizzes, title: "Vocabulary Quizzes", route: "vocab_quizzes"});
	}
    });
};

module.exports.get = function(req, res) {
    Subject.findById(req.param("subject")).select({name: true, subject_name: true, teacher: true, vocab_quizzes: {$elemMatch: {_id: req.param("quiz")}}}).populate("teacher").exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(vocabQuizPage, {subject: doc, quiz: doc.vocab_quizzes});
	}
    });
};

module.exports.del = function(req, res) {
    Subject.findByIdAndUpdate(req.param("subject"), {vocab_quizzes: {$pull: {_id: req.param("quiz")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(vocabQuizList, {subject: doc, quizzes: doc.vocab_quizzes, title: "Vocabulary Quizzes", route: "vocab_quizzes"});
	}
    });
};
