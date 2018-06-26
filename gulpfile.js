"use strict"

const gulp       = require("gulp"),
      scss       = require("gulp-sass"),
      sourcemaps = require("gulp-sourcemaps"),
      concat     = require("gulp-concat"),
      uglify     = require("gulp-uglify"),
      imagemin   = require("gulp-imagemin"),
      del        = require("del"),
      connect    = require("gulp-connect")

gulp.task("styles", done => {
    gulp.src("src/sass/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(scss({outputStyle: "compressed"}).on("error", scss.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/css"))
        .pipe(connect.reload())
    done()
})

gulp.task("scripts", done => {
    gulp.src("src/js/**/*.js")
        .pipe(concat("global.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"))
        .pipe(connect.reload())
    done()
})

gulp.task("images", done => {
    gulp.src("src/images/*")
        .pipe(imagemin([
                           imagemin.jpegtran({progressive: true}),
                           imagemin.optipng({optimizationLevel: 7})
                       ]))
        .pipe(gulp.dest("dist/images"))
        .pipe(connect.reload())
    done()
})

gulp.task("html", done => {
    gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
        .pipe(connect.reload())
    done()
})

gulp.task("clean", done => {
    del("dist/*")
    done()
})

gulp.task("watch", done => {
    const logChange = path => console.log("File " + path + " was changed")
    const logRemove = path => console.log("File " + path + " was removed")
    
    gulp.watch("src/js/**/*.js", gulp.parallel("scripts")).on("change", path => logChange(path)).on("unlink", path => logRemove(path))
    gulp.watch("src/**/*.scss", gulp.parallel("styles")).on("change", path => logChange(path)).on("unlink", path => logRemove(path))
    gulp.watch("src/*.html", gulp.parallel("html")).on("change", path => logChange(path)).on("unlink", path => logRemove(path))
    gulp.watch("src/images/*", gulp.parallel("images")).on("change", path => logChange(path)).on("unlink", path => logRemove(path))
    
    done()
})

gulp.task("connect", done => {
    connect.server({root: "dist", livereload: true})
    done()
})

gulp.task("default", gulp.series("clean", gulp.parallel("scripts", "styles", "html", "images", "connect", "watch")))

