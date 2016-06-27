var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
//var sass = require('gulp-sass');
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
  IS_RELEASE_BUILD: false,
  devDir: 'src/dev',
  distDir: 'src/dev',
  debugDir: 'src/dev',
  sources: {
    scss: ['src/public/CRMApp.scss'],
    html: ['src/**/*.html'],
    js: [
        'src/worksheet/takePicture/ion-gallery.js',
        'src/public/CRMApp.js',
        'src/public/services.js',
        'src/public/common.js',
        'src/public/controllers.js',
        'src/public/utils.js',
        
        'src/login/loginCtrl.js',
        'src/main/mainCtrl.js',
        'src/main/mainService.js',
        'src/login/loginServe.js',

        'src/employee/employeeCtrls.js',
        'src/employee/employeeModule.js',

        'src/contacts/contactCtrls.js',
        'src/contacts/contactModule.js',
        'src/contacts/relationship/contactRelationCtrls.js',

        'src/customer/customerinfo/customerCtrls.js',
        'src/customer/customerContacts/customerContactsCtrls.js',
        'src/customer/customerVehicle/customerVehicleCtrls.js',
        'src/customer/customerModule.js',
        'src/customer/customerChance/customerChanceCtrls.js',
        'src/customer/customerActivity/customerActivityCtrls.js',
        'src/customer/customerKey/customerKeyCtrls.js',
        'src/customer/customerWorkorder/customerWorkorderCtrls.js',
        'src/customer/customerFuZe/customerFuZeCtr.js',

        'src/applications/applications.js',
        'src/applications/saleActivities/saleActiviesCtrls.js',
        'src/applications/saleChance/saleChanceCtrls.js',
        'src/applications/saleActivities/saleActService.js',
        'src/applications/saleChance/saleChanService.js',
        'src/applications/addRelations/addRelationsCtrl.js',
        'src/applications/addRelations/relationService.js',
        'src/applications/saleActivities/modal/create_Modal/saleActCreateModal.js',
        'src/applications/saleChance/modal/create_Modal/saleChanCreateModal.js',
        'src/applications/saleClue/list/saleClueListCtrl.js',
        'src/applications/saleClue/detail/saleClueDetailCtrl.js',
        'src/applications/saleClue/saleClueService.js',
        'src/tabs/tabs.js',
        'src/car/carService.js',
        'src/car/carCtrl.js',
        'src/spare/spareListCtrl.js',
        'src/spare/spareListService.js',
        'src/worksheet/worksheetModule.js',
        'src/worksheet/worksheetCtrls.js',

        'src/worksheet/detailAll/detailAllCtrl.js',
        'src/worksheet/detailEdit/detailAllEditCtrl.js',
        'src/worksheet/baoGong/baogongListCtrl.js',
        'src/worksheet/dealHistoryList/dealHistoryListCtrl.js',
        'src/worksheet/takePicture/takePictureCtrl.js',
        'src/worksheet/selectStaff/selectStaffCtrl.js',
        'src/worksheet/carMileage/worksheetCarMileageCtr.js',
        'src/worksheet/faultInfos/worksheetFaultInfoCtr.js',
        'src/worksheet/sparePart/worksheetParePartCtr.js',
        'src/worksheet/relatedPart/worksheetRelatedPartCtr.js',

        'src/worksheet/baoGong/baoGongModule.js',
        'src/worksheet/baoGong/create/createCtrl.js',
        'src/worksheet/baoGong/detailAll/detailAllCtrls.js',
        'src/worksheet/baoGong/infos/infoListCtrl.js',
        'src/worksheet/baoGong/edit/editCtrl.js',

        'src/visit/visitModule.js',
        'src/visit/list/visitListCtrls.js',
        'src/visit/create/visitCreateCtrls.js',
        'src/visit/detail/visitDetailCtrls.js',
        'src/visit/edit/visitDetailEditCtrls.js',

        'src/signin/signinModule.js',
        'src/signin/list/signinListCtrls.js',
        'src/signin/create/signinCreateCtrls.js',
        'src/signin/detail/signinDetailCtrls.js',

        'src/settings/SettingModule.js',
        'src/settings/SettingCtrls.js',
        'src/settings/changePass/changePassCtrl.js',
        'src/settings/selectChar/changeCharCtrl.js',

        /*'src/worksheetReported/worksheetReportedDetail/worksheetReportedDeatilCtrl.js',
        'src/worksheetReported/worksheetReportedInfos/worksheetReportedInfoCtrl.js',
        'src/worksheetReported/worksheetReportedCtrl.js',
        'src/worksheetReported/worksheetReportedModule.js',*/

        'src/activityPlan/activityPlan_service.js',
        'src/activityPlan/activityPlanCtr.js',
        
        'src/salequote/saleQuote.js',
        'src/salequote/saleQuoteService.js',
        
        'src/myMap/myMapCtrl.js',
        'src/myMap/myMapService.js',
        'src/settings/forgetPass/forgetPassCtrl.js'
    ]
  },
  watchSass: 'src/**/*.scss'
};

/*gulp.task('default', ['watch-sass']);

gulp.task('watch-sass',['sass'], function(donw){
  gulp.watch(buildConfig.watchSass, ['sass']);
  console.log("====== watching hec sass files... =====");
});*/


/*gulp.task('sass', function(done) {
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
});*/

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

gulp.task('uglify-js', function(done){
    gulp
        .src('src/dev/CRMApp-all.js')
        .pipe(uglify())
        .pipe(gulp.dest(buildConfig.distDir))
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
        .pipe(uglify())
        //.pipe(gulpif(buildConfig.IS_RELEASE_BUILD, uglify()))
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