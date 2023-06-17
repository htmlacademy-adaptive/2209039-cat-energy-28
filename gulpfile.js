import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import svgo from 'svgo';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import { stacksvg } from "gulp-stacksvg"

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin( { collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

// SVG

export const sprite = () => {
  return gulp.src('./source/img/icons/*.svg')
   .pipe(svgstore({
    inLineSvg: true
   }))
   .pipe(rename('sprite.svg'))
   .pipe(gulp.dest('build/img'))
   .pipe(gulp.dest('source/img'))
}

const stack = () => {
  return gulp.src([
    'source/img/masks/*.svg'])
    .pipe(stacksvg({ stack }))
    .pipe(gulp.dest('build/img'))
    .pipe(gulp.dest('source/img'));
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const reload = (done) => {
  browser.reload();
  done();
};
gulp.watch("source/*.html", gulp.series(html, reload));

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// const watcher = () => {
//   gulp.watch('source/sass/**/*.scss', gulp.series(styles));
//   gulp.watch('source/*.html').on('change', browser.reload);
// }

export default gulp.series(
  styles,
  sprite,
  stack,
  gulp.series(
    server,
    watcher
));
