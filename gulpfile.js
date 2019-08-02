let gulp 			= require('gulp');
let autoprefixer 	= require('gulp-autoprefixer');
let cleanCSS     	= require('gulp-clean-css');
let uglify    		= require('gulp-uglify');
let babel 			= require('gulp-babel');
let imagemin 		= require('gulp-imagemin');


gulp.task('babel', () =>
	gulp.src('app/js/*.js')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
);

gulp.task('css', function() {
	gulp.src("app/css/*.css")
		.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest("dist/css"))
});

gulp.task('imgmin', function() {
	gulp.src('app/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
});