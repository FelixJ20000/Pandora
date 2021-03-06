var Backbone = require("./backbone");
var CodeBox = require("./codebox");

var EditorView = require("../views/editor.dust");

var EditorState = Backbone.Model.extend({
    defaults: {
		mode: "rich-text-editor"
    }
});

var EditorController = Backbone.Controller.extend({
    template: EditorView,

    className: "editor",

    events: {
		"change .editor-mode": "updateMode",
		"click .editor-toolbar button": "updateFormat",
		"change select.font-control": "updateFont",
		"click .editor-rich": "reconfigure",
		"keydown .editor-rich": "reconfigure",
		"DOMSubtreeModified .editor-rich": "transpose",
		"change .editor-latex": "transpose",
		"click .open-editor": "openEditor",
		"click .open-preview": "openPreview"
    },

    setControl: function(ctrl) {
		this.controls = ctrl;
		this.controls.hide();
		this.$el.insertBefore(this.controls);
		this.render();
		this.$el.find(".editor-content").html(this.controls.val());
    },

    initialize: function(options) {
		this.state = new EditorState();
		this.state.set("modeName", options.modeName);
		this.listenTo(this.state, "change", this.render);
		this.setControl(options.controls);
    },

    updateMode: function(e) {
		this.state.set("mode", e.target.value);
		this.trigger("change", "");
		e.preventDefault();
    },

    // Controls everything from bold to insertUnorderedList
    updateFormat: function(e) {
		var target = $(e.target);
		document.execCommand(target.val());
		target.toggleClass("active");
		e.preventDefault();
    },

    updateFont: function(e) {
		document.execCommand("fontName", false, e.target.value);
    },

    reconfigure: function(e) {
		["bold", "underline", "italic", "insertOrderedList", "insertUnorderedList"].forEach((function(option) {
			if(document.queryCommandState(option)) {
				this.find("[value=\"" + option + "\"]").addClass("active");
			} else {
				this.find("[value=\"" + option + "\"]").removeClass("active");
			}
		}).bind(this));
    },

    transpose: function(e) {
		console.log("fdsdfs");
		if(this.controls) {
			var editor = $(e.target);
			var val = (this.state.get("mode") === "rich-text-editor" ? editor.html() : this.editor.val());
			this.trigger("change", val);
			this.controls.val(val);
			console.log("fsdsdfsdf");
		}
    },

    openEditor: function(e) {
		this.find(".editor-preview").hide();
		this.find(".editor-content").show();
		$(e.target).toggleClass("active");
		$(e.target).siblings().removeClass("active");
    },

    openPreview: function(e) {
		$(e.target).toggleClass("active");
		$(e.target).siblings().removeClass("active");
		this.find(".editor-content").hide();
		var editorPreview = this.find(".editor-preview");
		editorPreview.html($("<script type=\"math/tex\">").html(this.editor.val()));
		editorPreview.show();
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, editorPreview.get(0)]);
    },

    subviews: function(e) {
		console.log(this.controls.val());
		this.$el.find(".editor-content").val(this.controls.val());
		if(this.state.get("mode") === "latex") {
			this.editor = CodeBox.create({
				el: this.find(".editor-content"),
				mode: CodeBox.Modes.LaTeX
			});
		} else {
			this.editor = undefined;
		}
    }
});

module.exports = EditorController;
