const gulp = require('gulp')
const ghPages = require('gulp-gh-pages')

gulp.task('update-docs', function() {
  return gulp.src('./docs/**/*')
    .pipe(ghPages({
      'remoteUrl' : 'https://ertrzyiks:' + process.env.GITHUB_TOKEN + '@github.com/ertrzyiks/ketchup-server.git'
    }))
})
