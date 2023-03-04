const { src, dest, watch, parallel } = require("gulp"); // require igual a import

// CSS
// src identificar un archivo, dest guardar en disco duro
const sass = require("gulp-sass")(require("sass"));
// plumber es para que no se detenga el watch si hay un error
const plumber = require('gulp-plumber');
// para mejorar el código css
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
// para identificar el código css una vez compactado en una linea con lo anterior
const sourcemaps = require('gulp-sourcemaps');

// Imágenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

function css(done) {
  // Identificar el archivo SASS y lo mantiene en memoria hasta que finaliza la función
  // se identifica con src importado de gulp
  // Compilarlo con .pipe( sass()) importado de sass
  // Almacenarla en el disco duro
  src("src/scss/**/*.scss") // Identifica
    .pipe(sourcemaps.init())
    .pipe(plumber()) // usa plumb para no detener código si hay un error
    .pipe(sass()) // Compila
    .pipe( postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css")) // Guarda
  
  done(); // Callback que avisa a gulp cuando llegamos al final
}

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3
  }
  src('src/img/**/*.{png,jpg}')
    .pipe( cache( imagemin(opciones) ) )
    .pipe( dest('build/img') )
  done();
}

function versionWebp( done ) {
  const opciones = {
    quality: 50
  };
  src('src/img/**/*.{png,jpg}')
    .pipe( webp(opciones) )
    .pipe( dest('build/img'))

  done();
}

function versionAvif( done ) {
  const opciones = {
    quality: 50
  };
  src('src/img/**/*.{png,jpg}')
    .pipe( avif(opciones) )
    .pipe( dest('build/img'))

  done();
}

function javascript( done ) {
  src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe( terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));
  
    done();
}

function dev(done) {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);
  done();
}

// Llamamos a la función
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev);