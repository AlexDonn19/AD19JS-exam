'use strict';

var gulp = require('gulp'),
    gulpsync = require('gulp-sync')(gulp),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),  // вендорные префиксы
    spritesmith = require('gulp.spritesmith'), // собрать спрайты png
    svgSprite = require('gulp-svg-sprite'),   // svg- sprite
    cleanCSS = require('gulp-clean-css'),     // сжать CSS
    concatCss = require('gulp-concat-css'),   // объединить css
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),          // сжать JS
    imagemin = require('gulp-imagemin'),      // сжать картинки
    imageminPngquant = require('imagemin-pngquant'),  // дополнение для png
    rimraf = require('rimraf'),               // чистить папки
    rigger = require('gulp-rigger');          // импорт частей файлов html


var path = {
    build: { // куда складывать готовые файлы
        html: './',
        js: './js',
        css: './css',
        img: './img',
        ie8js: './js/ie8',
        fonts: './fonts'
    },
    src: { // откуда брать исходники
        html: 'src/html/*.html',
        js: 'src/js/*.js',
        plugins: 'src/plugins/*.js',
        ie8plugins: 'src/plugins/ie8/*.js',
        style: 'src/scss/*.scss',
        ie8scss: 'src/scss/ie8/ie8.scss',
        sprites: 'src/sprites/*.*',
        svg: 'src/svg/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

// таск для сборки html:

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger()) // через rigger влить части
        .pipe(gulp.dest(path.build.html)); //выгрузить в папку build
});

// по сборке скриптов - отдельно по JS и по JS для ie8
gulp.task('js:build', function () {
    return gulp.src('./src/js/*.js')
        .pipe(concat('script.js'))  // склеить js
        .pipe(uglify())             // сжать js
        .pipe(gulp.dest(path.build.js));
});

gulp.task('plugins:build', function () {
    return gulp.src('./src/plugins/**/*.js')  // скопировать плагины
        .pipe(gulp.dest('./js'));
});


// собрать SVG спрайт
gulp.task('sprite-svg:build', function () {
    var configSVG = {
        mode            : {
            css         : {
                bust    : false,
                layout: 'horizontal',
                sprite: '../img/sprite.svg',
                render  : {
                  css   : true
                }
            }
        }
    };
    return gulp.src('n*.svg', {cwd: './src/svg/'})
        .pipe(svgSprite(configSVG))
        .pipe(gulp.dest('./src'));
});

// собрать спрайт для IE8
gulp.task('sprite-png:build', function() {
    var spriteData =
        gulp.src('./src/sprites/n*.png') // взять картинки для спрайта
            .pipe(spritesmith({
                retinaSrcFilter: ['./src/sprites/*@2x.png'],
                imgName: 'sprite-file.png',
                retinaImgName: 'sprite-file@2x.png',
                imgPath: '../img/sprite-file.png',
                cssName: 'sprite-file.css',
                algorithm: 'left-right'
            }));
    spriteData.img.pipe(gulp.dest('./src/img/'));
    spriteData.css.pipe(gulp.dest('./src/css/ie8/'));

    var spriteControl =
        gulp.src('./src/sprites/control*.png') // взять картинки для спрайта
            .pipe(spritesmith({
                retinaSrcFilter: ['./src/sprites/control*@2x.png'],
                imgName: 'sprite-control.png',
                retinaImgName: 'sprite-control@2x.png',
                imgPath: '../img/sprite-control.png',
                cssName: 'sprite-control.css',
                algorithm: 'left-right'
            }));
    spriteControl.img.pipe(gulp.dest('./src/img/'));
});


// собрать SCSS:
gulp.task('style:build', function () {
    return gulp.src('./src/scss/**/*.scss') // отдельно SASS и SASS for IE8
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('css-concat:build', function () {

    gulp.src('./src/css/*.css')     // сжать-объединить css
        .pipe(concatCss("main.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./css'));
    gulp.src('./src/css/ie8/*.css') // сжать css для ie8
        .pipe(concatCss("ie8.css"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./css'));

});

// Таск по картинкам:
gulp.task('image:build', function () {
    return gulp.src(path.src.img) // выбрать  картинки
        .pipe(imagemin({   // сжать их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [imageminPngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)); // в build
});

// файлы из src/fonts  в  /fonts
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

// таск с именем «build» - запускает все
gulp.task('build', gulpsync.async(['html:build', [
    [ 'sprite-svg:build', 'sprite-png:build'],
    [ 'style:build', 'js:build', 'plugins:build'],
    'css-concat:build', 'image:build'
],  'fonts:build']));

// в папках чистить
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

// дефолтный таск
gulp.task('default', ['build']);

