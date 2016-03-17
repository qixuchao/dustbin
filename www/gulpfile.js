var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
//var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var html2js = require('gulp-html2js');
var uglify = require('gulp-uglify');
//var group = require('gulp-group-files');

//npm install -g node-sass
//npm install --save-dev gulp gulp-clean gulp-minify-css  gulp-concat gulp-if gulp-ruby-sass
//npm install --save-dev gulp-rename gulp-strip-debug gulp-html2js gulp-uglify gulp-group-files

var buildConfig = {
  IS_RELEASE_BUILD: true,
  devDir: 'src/dev',
  distDir: 'dist',
  debugDir: 'debug',
  sources: {
    scss: ['src/public/CRMApp.scss'],
    html: ['src/**/*.html'],
    js: ['src/**/*.js']
  },
  watchSass: 'src/**/*.scss'
};

gulp.task('default', ['watch-sass']);

gulp.task('watch-sass',['sass'], function(donw){
  gulp.watch(buildConfig.watchSass, ['sass']);
  console.log("====== watching hec sass files... =====");
});


gulp.task('sass', function(done) {
  gulp.src("src/public/CRMApp.scss")
  //gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(buildConfig.devDir))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(buildConfig.devDir))
    .on('end', done);
});

gulp.task('patch-html', function (done) {
    // 合并所有html文件至 --> {buildConfig.distDir}\crm-templates.js
    //                        {buildConfig.distDir}\crm-templates.min.js
    gulp.src(buildConfig.sources.html)
        .pipe(minifyHTML({
            conditionals: true,
            spare: true,
            quotes: true,
            comments: false,
            cdata: true,
            empty: true,
            loose: true
        }))
        .pipe(html2js({
            base: './',
            outputModuleName: 'crm-templates',
            useStrict: true
        }))
        .pipe(concat("CRMApp-templates.js"))
        gulpif(
            buildConfig.IS_RELEASE_BUILD,
            gulp.dest(buildConfig.distDir),
            gulp.dest(buildConfig.debugDir)
        )
        .pipe(gulpif(buildConfig.IS_RELEASE_BUILD, uglify()))
        .pipe(rename({extname: '.min.js'}))
        .pipe(
            gulpif(
                buildConfig.IS_RELEASE_BUILD,
                gulp.dest(buildConfig.distDir),
                gulp.dest(buildConfig.debugDir)
            )
        )
        .on('end', done);
});

gulp.task('patch-js', function(done){
    // 合并并压缩所有的js文件至(包括crm-templates.js)
    //                      {buildConfig.distDir}\crm-all.js
    //                      {buildConfig.distDir}\crm-all.min.js
    gulp.src(buildConfig.sources.js)
        .pipe(stripDebug())
        .pipe(concat('CRMApp-all.js'))
        .pipe(
            gulpif(
                buildConfig.IS_RELEASE_BUILD,
                gulp.dest(buildConfig.distDir),
                gulp.dest(buildConfig.debugDir)
            )
        )
        //.pipe(gulpif(IS_RELEASE_BUILD, uglify()))
        .pipe(rename({extname: '.min.js'}))
        .pipe(
            gulpif(
                buildConfig.IS_RELEASE_BUILD,
                gulp.dest(buildConfig.distDir),
                gulp.dest(buildConfig.debugDir)
            )
        )
        .on('end', done);
});