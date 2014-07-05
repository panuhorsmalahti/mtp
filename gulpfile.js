/*jslint node:true */
'use strict';

var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc');


gulp.task('doc', function () {
    gulp.src('./*.js')
        .pipe(jsdoc('./doc'));
});
