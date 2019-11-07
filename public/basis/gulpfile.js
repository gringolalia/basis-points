'use strict';

/**
 * Import node modules
 */
var gulp         = require('gulp');
var stylus       = require('gulp-stylus');
var rename       = require('gulp-rename');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano      = require('cssnano');
var zip          = require('gulp-zip');
var uglify       = require('gulp-uglify');
var rollup       = require('gulp-rollup');
var nodeResolve  = require('rollup-plugin-node-resolve');
var commonjs     = require('rollup-plugin-commonjs');
var babel        = require('rollup-plugin-babel');
var plumber      = require('gulp-plumber');
var aigis        = require('gulp-aigis');
var browserSync  = require('browser-sync');

var dir = {
  src: {
    css  : 'src/css',
    js   : 'src/js',
    font : 'src/font',
    aigis: 'src/aigis'
  },
  dist: {
    css  : 'dist/css',
    js   : 'dist/js',
    font : 'dist/font',
    aigis: 'dist/aigis'
  }
};

/**
 * Stylus to CSS
 */
gulp.task('css', function() {
  return gulp.src(
      [
        dir.src.css + '/basis.styl',
        dir.src.css + '/plugin/basis-ie9/basis-ie9.styl'
      ],
      {base: dir.src.css}
    )
    .pipe(plumber())
    .pipe(stylus({
      'resolve url': true,
      include: 'node_modules/normalize-styl'
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    ]))
    .pipe(gulp.dest(dir.dist.css))
    .pipe(postcss([cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dir.dist.css));
});

/**
 * Build javascript
 */
gulp.task('js', function() {
  gulp.src(dir.src.js + '/**/*.js')
    .pipe(plumber())
    .pipe(rollup({
      allowRealFiles: true,
      entry: dir.src.js + '/basis.js',
      format: 'iife',
      external: ['jquery'],
      globals: {
        jquery: "jQuery"
      },
      plugins: [
        nodeResolve({ jsnext: true }),
        commonjs(),
        babel({
          presets: ['es2015-rollup'],
          babelrc: false
        })
      ]
    }))
    .pipe(gulp.dest(dir.dist.js))
    .on('end', function() {
      gulp.src([dir.dist.js + '/basis.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dir.dist.js));
    });
});

/**
 * Build font
 */
gulp.task('font', function() {
  return gulp.src(dir.src.font + '/*')
    .pipe(gulp.dest(dir.dist.font));
});

/**
 * Styleguide
 */
gulp.task('aigis:update', function() {
  return _aigis();
});
gulp.task('aigis:build', ['build'], function() {
  return _aigis();
});
function _aigis() {
  return gulp.src(dir.src.aigis + '/aigis_config.yml')
    .pipe(aigis())
}

/**
 * Auto Build
 */
gulp.task('watch', function() {
  gulp.watch([dir.src.css + '/**/*.styl'], ['css']);
  gulp.watch([dir.src.js + '/**/*.js'], ['js']);
  gulp.watch(
    [
      dir.src.css + '/**/*.styl',
      dir.src.js + '/**/*.js'
    ],
    ['aigis:update']
  );
});

/**
 * Build
 */
gulp.task('build', ['css', 'js', 'font']);

/**
 * Browsersync
 */
gulp.task('server', ['aigis:build'], function() {
  browserSync.init( {
    server: {
      baseDir: dir.dist.aigis + '/'
    },
    files: [
      dir.dist.aigis + '/index.html'
    ]
  });
});

/**
 * Creates the zip file
 */
gulp.task('zip', function() {
  return gulp.src(
      [
        '**',
        '.editorconfig',
        '.gitignore',
        '!node_modules',
        '!node_modules/**',
        '!basis.zip'
      ]
      , {base: './'}
    )
    .pipe(zip('basis.zip'))
    .pipe(gulp.dest('./'));
});

/**
 * Stylus tests
 */
gulp.task('test', function() {
  return gulp.src('./tests/tests.styl')
    .pipe(plumber())
    .pipe(stylus({
      'resolve url nocheck': true
    }))
    .pipe(gulp.dest('./tests'));
});

gulp.task('default', ['watch', 'server']);
