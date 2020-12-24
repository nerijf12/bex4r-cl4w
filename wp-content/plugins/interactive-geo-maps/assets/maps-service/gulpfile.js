var gulp = require("gulp");
var uglify = require("gulp-uglify");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var striplog = require("gulp-strip-debug");
var minfycss = require("gulp-minify-css");
var gutil = require("gulp-util");
var babel = require("gulp-babel");

// Sources
var css_src = "src/css/*.css",
	css_dest = "assets/css",
	js_src = [
		"src/js/geocluster.js",
		"src/js/router.js",
		"src/js/model.js",
		"src/js/manager.js",
		"src/js/app.js",
		"src/js/*.js"
	],
	js_dest = "assets/js";

// My js files
gulp.task("scripts", function () {
	// pipe the js through concat, console log stripping, uglification and then store
	return (
		gulp
			.src(js_src)
			.pipe(concat("app.min.js")) // concat all files in the src
			.pipe(babel({
				presets: ['@babel/env']
			}))
			//.pipe(striplog())
			//.pipe(uglify()) // uglify them all
			.pipe(gulp.dest(js_dest)) // save the file
			.on("error", gutil.log)
	);
});

// My css files
gulp.task("css", function () {
	// Concat and minify all the css
	return gulp
		.src(css_src)
		.pipe(concat("app.min.css")) // concat all files in the src
		.pipe(minfycss()) // uglify them all
		.pipe(gulp.dest(css_dest)) // save the file
		.on("error", gutil.log);
});

// Clean all builds
gulp.task("clean", function () {
	return gulp.src(["assets/"], { read: false }).pipe(clean());
});

// Task to watch for changes in our file sources
gulp.task("watch", function () {
	gulp.watch(css_src, ["css"]); // If any changes in 'sassMain', perform 'sass' task
	gulp.watch(js_src, ["scripts"]);
});

// Default task - clean the build dir
// Then rebuild the js and css files
gulp.task("default", ["clean"], function () {
	gulp.start("css", "scripts", "watch");
});
