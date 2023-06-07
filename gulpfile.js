import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import svgo from 'svgo';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';

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

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

export default gulp.series(
  styles,
  sprite,
  gulp.series(
    server,
    watcher
));
