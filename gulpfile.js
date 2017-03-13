'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var marko_ax5 = require('gulp-marko-ax5');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var babel = require('gulp-babel');
var argv = require('yargs').argv; // for args parsing
var spawn = require('child_process').spawn;

var API_URL = "http://api-demo.ax5.io";
var KERNEL_PATH = '../ax5ui-kernel/';
var PATHS = {
    kernel: KERNEL_PATH,
    assets: {
        src: "assets"
    },
    ax5docs: {
        css_src: "assets/css",
        css_dest: "assets/css",
        doc_src: "_src_",
        doc_dest: "."
    },
    ax5core: {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5core",
        doc_src: "_src_/ax5core",
        doc_dest: "ax5core"
    },
    "ax5ui-dialog": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-dialog",
        doc_src: "_src_/ax5ui-dialog",
        doc_dest: "ax5ui-dialog"
    },
    "ax5ui-mask": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-mask",
        doc_src: "_src_/ax5ui-mask",
        doc_dest: "ax5ui-mask"
    },
    "ax5ui-toast": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-toast",
        doc_src: "_src_/ax5ui-toast",
        doc_dest: "ax5ui-toast"
    },
    "ax5ui-modal": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-modal",
        doc_src: "_src_/ax5ui-modal",
        doc_dest: "ax5ui-modal"
    },
    "ax5ui-calendar": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-calendar",
        doc_src: "_src_/ax5ui-calendar",
        doc_dest: "ax5ui-calendar"
    },
    "ax5ui-picker": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-picker",
        doc_src: "_src_/ax5ui-picker",
        doc_dest: "ax5ui-picker"
    },
    "ax5ui-formatter": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-formatter",
        doc_src: "_src_/ax5ui-formatter",
        doc_dest: "ax5ui-formatter"
    },
    "ax5ui-menu": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-menu",
        doc_src: "_src_/ax5ui-menu",
        doc_dest: "ax5ui-menu"
    },
    "ax5ui-media-viewer": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-media-viewer",
        doc_src: "_src_/ax5ui-media-viewer",
        doc_dest: "ax5ui-media-viewer"
    },
    "ax5ui-select": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-select",
        doc_src: "_src_/ax5ui-select",
        doc_dest: "ax5ui-select"
    },
    "ax5ui-layout": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-layout",
        doc_src: "_src_/ax5ui-layout",
        doc_dest: "ax5ui-layout"
    },
    "ax5ui-combobox": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-combobox",
        doc_src: "_src_/ax5ui-combobox",
        doc_dest: "ax5ui-combobox"
    },
    "ax5ui-grid": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-grid",
        doc_src: "_src_/ax5ui-grid",
        doc_dest: "ax5ui-grid"
    },
    "ax5ui-autocomplete": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-autocomplete",
        doc_src: "_src_/ax5ui-autocomplete",
        doc_dest: "ax5ui-autocomplete"
    },
    "ax5ui-binder": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-binder",
        doc_src: "_src_/ax5ui-binder",
        doc_dest: "ax5ui-binder"
    },
    "ax5ui-uploader": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-uploader",
        doc_src: "_src_/ax5ui-uploader",
        doc_dest: "ax5ui-uploader"
    },
    "ax5ui-docker": {
        isPlugin: true,
        root: KERNEL_PATH + "src/ax5ui-docker",
        doc_src: "_src_/ax5ui-docker",
        doc_dest: "ax5ui-docker"
    }
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
}


gulp.task('default', function () {
    var process;

    gulp.watch(PATHS.assets.src + '/_layouts/root.marko', spawnChildren);
    gulp.watch(PATHS.assets.src + '/_layouts/index.marko', spawnChildren);
    gulp.watch(PATHS.assets.src + '/_layouts/modal.marko', spawnChildren);
    gulp.watch(PATHS.assets.src + '/components/**/*.js', spawnChildren);
    spawnChildren();

    function spawnChildren(e) {
        // kill previous spawned process
        if(process) { process.kill(); }

        // `spawn` a child `gulp` process linked to the parent `stdio`
        process = spawn('gulp', ['docs:all', 'watching'], {stdio: 'inherit'});
    }
});

/**
 * SASS
 */
gulp.task('docs-scss', function () {
    gulp.src(PATHS.ax5docs.css_src + '/docs.scss')
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS.ax5docs.css_dest));
});

/**
 * ax5docs templete render
 */
gulp.task('AX5UI-docs', function () {
    return gulp.src(PATHS['ax5docs'].doc_src + '/*.html')
        .pipe(changed(PATHS['ax5docs'].doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(marko_ax5({
            projectName: "ax5ui",
            layoutPath: PATHS.assets.src + '/_layouts/root.marko',
            layoutModalPath: PATHS.assets.src + '/_layouts/modal.marko',
            kernelPath: PATHS.kernel,
            apiUrl: API_URL
        }))
        .pipe(gulp.dest(PATHS['ax5docs'].doc_dest));
});

for (var k in PATHS) {
    var __p = PATHS[k];
    if (__p.isPlugin) {
        gulp.task(k + '-docs', (function (k, __p) {
            return function () {
                return gulp.src(PATHS[k].doc_src + '/**/*.html')
                    .pipe(changed(PATHS[k].doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
                    //.pipe(plumber({errorHandler: errorAlert}))
                    .pipe(marko_ax5({
                        projectName: k,
                        layoutPath: PATHS.assets.src + '/_layouts/index.marko',
                        layoutModalPath: PATHS.assets.src + '/_layouts/modal.marko',
                        kernelPath: PATHS.kernel,
                        apiUrl: API_URL
                    }))
                    .pipe(gulp.dest(PATHS[k].doc_dest));
            }
        })(k, __p));
    }
}

gulp.task('docs:all', function () {
    gulp.src(PATHS['ax5docs'].doc_src + '/*.html')
        .pipe(marko_ax5({
            projectName: "ax5ui",
            layoutPath: PATHS.assets.src + '/_layouts/root.marko',
            layoutModalPath: PATHS.assets.src + '/_layouts/modal.marko',
            kernelPath: PATHS.kernel
        }))
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(gulp.dest(PATHS['ax5docs'].doc_dest));

    for (var k in PATHS) {
        var __p = PATHS[k];
        if (__p.isPlugin) {
            gulp.src(PATHS[k].doc_src + '/**/*.html')
                .pipe(marko_ax5({
                    projectName: k,
                    layoutPath: PATHS.assets.src + '/_layouts/index.marko',
                    layoutModalPath: PATHS.assets.src + '/_layouts/modal.marko',
                    kernelPath: PATHS.kernel,
                    apiUrl: API_URL
                }))
                .pipe(plumber({errorHandler: errorAlert}))
                .pipe(gulp.dest(PATHS[k].doc_dest));
        }
    }
});

gulp.task('import-ax5ui-file', function () {
    for (var k in PATHS) {
        var __p = PATHS[k];
        if (__p.isPlugin) {
            gulp.src([
                '!../ax5ui-kernel/src/' + k + '/**/test/**/*',
                '!../ax5ui-kernel/src/' + k + '/**/node_modules/**/*',
                '../ax5ui-kernel/src/' + k + '/**/src/**/*',
                '../ax5ui-kernel/src/' + k + '/**/dist/**/*',
                '../ax5ui-kernel/src/' + k + '/**/*.json',
                '../ax5ui-kernel/src/' + k + '/**/*.md'
            ], {base: "../ax5ui-kernel/src"})
                .pipe(gulp.dest(PATHS.assets.src + '/lib'));
        }
    }
});

/**
 * watch
 */
gulp.task('watching', function () {
    // SASS
    gulp.watch(PATHS.ax5docs.css_src + '/**/*.scss', ['docs-scss']);
    // for MD
    gulp.watch(PATHS.ax5docs.doc_src + '/*.html', ['AX5UI-docs']);

    for (var k in PATHS) {
        var __p = PATHS[k];
        if (__p.isPlugin) {
            //console.log(k);
            gulp.watch([PATHS[k].doc_src + '/**/*.html', PATHS[k].root + '/**/*.md'], [k + '-docs']);
        }
    }
});
