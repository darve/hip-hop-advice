module.exports = function (grunt) {

    grunt.initConfig({

        /*
        * Grab the settings from the package file
        */
        pkg: grunt.file.readJSON('package.json'),

        /*
        * Lint all non-vendor scripts
        */
        jshint: {
            dev: {
                options: {
                    jshintrc: true
                },
                src: ['app/assets/scripts/**/*.js']    
            },
            dist: {
                options: {
                    jshintrc: true
                },
                src: ['dist/assets/scripts/**/*.js']
            }
            
        },

        /*
        * Kill any generated files
        */
        clean: {
            dist: {
                src: ['dist']
            }
        },

        /*
        * Copy files to the dist folder
        */
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        src: 'assets/fonts/*',
                        dest: 'dist/',
                        filter: 'isFile',
                        cwd: 'app/'
                    }
                ]
            },
            img: {
                files: [
                    {
                        expand: true,
                        src: 'assets/img/*',
                        dest: 'dist/',
                        filter: 'isFile',
                        cwd: 'app/'
                    }
                ]
            },
            json: {
                files: [
                    {
                        expand: true,
                        src: 'api/*',
                        dest: 'dist/',
                        filter: 'isFile',
                        cwd: 'app/'
                    }
                ]
            }
        },

        /*
        * Concatenate the script files
        */
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: 'app/assets/scripts/**/*.js',
                dest: 'dist/assets/scripts/app.js'
            },
            vendor: {
                src: ['app/assets/vendor/js/angular/angular.js', 'app/assets/vendor/**/*.js', '!app/assets/vendor/**/*.min.js'],
                dest: 'dist/assets/scripts/vendor.js'
            }
        },

        /*
        * JS Minification
        */
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/assets/scripts/app.min.js': ['<%= concat.dist.dest %>']
                }
            },
            vendor: {
                files: {
                    'dist/assets/scripts/vendor.min.js': ['<%= concat.vendor.dest %>']
                }
            },
            views: {
                files: {
                    'dist/assets/scripts/views.min.js': 'app/assets/scripts/views.js'
                }
            }
        },

        /*
        * Parse the script tags in the html file
        */
        processhtml: {
            dist: {
                files: {
                    'dist/index.html': ['app/index.html']
                }
            }
        },

        /*
        * Config compass
        */
        compass: {
            dev: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'app/assets/css',
                    config: 'config.rb'
                }
            },
            dist: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'dist/assets/css',
                    config: 'config.rb',
                    outputStyle: 'compressed',
                    imagesDir: "dist/assets/img"
                }
            }
        },

        /*
        * Angular templates
        */
        ngtemplates: {
            BriocheApp: {
                module: 'BriocheApp',
                src: 'app/views/*.html',
                dest: 'app/assets/scripts/views.js',
                htmlmin: {
                  collapseWhitespace: true,
                  removeComments: true
                },
                url: function (url) {
                    var name = url.split('/');
                    return name[name.length - 1];
                }
            }
        },

        /*
        * Tasks instigated by 'grunt watch'
        */
        watch: {
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['compass:dev']
            },
            angular: {
                files: ['app/views/**/*.html'],
                tasks: ['ngtemplates']
            },
            lint: {
                files: ['/app/assets/scripts/**/*.js'],
                tasks: ['jshint:dev']
            }
        }
    });

    /*
    * Register the common grunt tasks
    */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-processhtml');

    /*
    * Task aliases
    */
    grunt.registerTask('build', [ 'clean', 'jshint:dev', 'ngtemplates', 'compass:dist', 'copy', 'concat', 'uglify', 'processhtml' ]);
    grunt.registerTask('lint', [ 'jshint:dev' ]);
    grunt.registerTask('templates', [ 'ngtemplates' ]);

    /*
    * Running grunt with no parameters will run the following tasks
    */
    grunt.registerTask('default', [ 'build' ]);
};