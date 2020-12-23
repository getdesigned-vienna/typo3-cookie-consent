// Package JSON
const pkg = require('./package.json');

// gulp itself
const gulp = require('gulp');

// load development packages
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

// compile SCSS
gulp.task('scss', () => {
    return gulp.src('./Resources/Private/Styles/*.scss')
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(gulp.dest('./.gulp-cache/css'))
        .pipe($.touchFd());
});

// minify CSS bundle
gulp.task('minify-css', () => {
    return gulp.src(['./.gulp-cache/css/cookieconsent.css'])
        .pipe($.cleanCss())
        .pipe($.rename((path) => {
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('./Resources/Public/Styles'))
        .pipe($.touchFd());
});

// task groups
gulp.task('styles', gulp.series('scss', 'minify-css'));

gulp.task('compile', gulp.parallel('styles'));
gulp.task('default', gulp.parallel('compile'));
