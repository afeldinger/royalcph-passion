module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
          livereload: true,
      },
      scripts: {
        files: ['src/assets/js/**/*.js'],
        tasks: ['jshint'],
        options: {
            spawn: false,
        },
      },
      images: {
        files: ['src/assets/img/**/*.{png,jpg,gif}'],
        tasks: ['imagemin'],
        options: {
          spawn: false,
        }
      },

      globbing: {
        files: ['src/assets/sass/**/*.scss'],
        tasks: ['sass_globbing:dev'],
        options: {
          event: ['added', 'deleted'],
        },
      },

      styles: {
        files: ['src/assets/sass/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer:dev'],
        options: {
            spawn: false,
        }
      },

      handlebars: {
        files: ['src/templates/layouts/*.hbs', 'src/templates/partials/**/*.hbs', 'src/templates/pages/*.hbs', 'src/templates/data/*.json'],
        tasks: ['assemble'],
      },
    },


    // Assembles your page content with html layout
    assemble: {
      options: {
        layoutdir: 'src/templates/layouts',
        layout: 'section.hbs',
        partials: ['src/templates/partials/**/*.hbs'],
        assets: './src/assets',
        helpers: [
          'handlebars-helpers',
          'helper-aggregate',
          //'handlebars-helper-partial',
          //'handlebars-helper-autolink',
          //'handlebars-helper-isactive',
          './src/templates/helpers/**/*.js',
        ],

        history: grunt.file.readJSON('src/templates/data/history.json'),
        inspiration: grunt.file.readJSON('src/templates/data/inspiration.json'),
        blue: grunt.file.readJSON('src/templates/data/blue.json'),
        pattern: grunt.file.readJSON('src/templates/data/pattern.json'),
        products: grunt.file.readJSON('src/templates/data/products.json'),
        passion: grunt.file.readJSON('src/templates/data/passion.json'),

        //flatten: true,
        marked: {
          gfm: false,
        },
      },

      pages: {
        files: [{
          cwd: './src/templates/pages/',
          dest: 'dist/',
          expand: true,
          src: '**/*.hbs',
        }],
      },

    },

    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          collapseWhitespace: false,
          preserveLineBreaks: true,
        },
        files: [{
            expand: true,
            cwd: 'dist/',
            src: '**/*.html',
            dest: 'dist/'
        }]
      },
    },

    prettify: {
      dist: {
        files: [{
            expand: true,
            cwd: 'dist/',
            src: '**/*.html',
            dest: 'dist/'
        }]
      }
    },


    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['src/assets/js/{,**/}*.js', '!src/assets/js/libs/**/*.js']
    },

    imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: 'src/assets/img/',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'dist/assets/img/'
            }]
        }
    },

    svgmin: {
        options: {
            plugins: [
                {
                    removeViewBox: false
                }, {
                    removeUselessStrokeAndFill: false
                }
            ]
        },
        dist: {
            files: [{
                expand: true,
                cwd: 'src/assets/img/',
                src: ['**/*.svg'],
                dest: 'dist/assets/img/'
            }]
        }
    },

    
    // Grunt-sass 
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/assets/sass',
          src: ['**/*.scss'],
          dest: 'src/assets/css',
          ext: '.css'
        }]
      },
      options: {
        sourceMap: true, 
        outputStyle: 'nested', 
        imagePath: "../img/",
      }
    },

    sass_globbing: {
      dev: {
        files: {
          //'src/assets/sass/globbing/_variables.scss': 'src/assets/sass/variables/**/*.scss', // handled manually
          //'src/assets/sass/globbing/_base.scss': 'src/assets/sass/base/**/*.scss',
          'src/assets/sass/globbing/_abstractions.scss': 'src/assets/sass/abstractions/*.scss',
          'src/assets/sass/globbing/_components.scss': 'src/assets/sass/components/**/*.scss',
          'src/assets/sass/globbing/_pages.scss': 'src/assets/sass/pages/**/*.scss',
        },
      },
      options: {
        useSingleQuotes: false
      }
    },


    autoprefixer: {

        options: {
          browsers: ['last 2 versions', 'ie >= 9']
        },
        dev: {
            files: {
                'src/assets/css/default.css': 'src/assets/css/default.css',
            },
        },
    },

    clean: {
      dist: {
        src: ['dist/*', '!dist/.htaccess'],
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true, 
            cwd: 'src/assets/fonts/', 
            src: ['*.{svg,woff,eot,ttf}'],
            dest: 'dist/assets/fonts/',
          },
          {
            expand: true,
            cwd: 'src/assets/js/',
            src: [
              'libs/modernizr.min.js'
            ],
            dest: 'dist/assets/js/',
          },
          {
            expand: true,
            cwd: 'src/assets/favicons/',
            src: ['*'],
            dest: 'dist/',
          }
        ],
      },

    },

    useminPrepare: {
      html: 'dist/single-page.html',
    },

    usemin: {
      html: 'dist/*.html',
      options: {
          dirs: ['dist/']
      }
    },


    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /(\.\.\/src\/assets\/|src\/assets\/|assets\/)/g,
              replacement: 'http://git.krympevaerk.dk/royalcph/passion/dist/assets/',
            },
          ]
        },
        files: [
          {
            expand: true, 
            //flatten: true, 
            cwd: 'dist',
            src: ['**/*.{html,css}'],
            dest: 'dist/.'
          }
        ]
      },
    },


  });

  // Load plugins
  require('matchdep').filterDev(['grunt-*', 'assemble']).forEach(grunt.loadNpmTasks);


  grunt.registerTask('common', ['assemble', 'prettify', 'sass_globbing', 'sass:dev', 'autoprefixer']);

  // Default task(s).
  grunt.registerTask('default', ['clean:dist', 'common', 'watch']);

  // Build minified assets
  grunt.registerTask('build', [
    'clean:dist',
    'common',
    //'htmlmin', 
    'imagemin',
    'svgmin',
    'useminPrepare', 
    'concat',
    'cssmin',
    'uglify',
    'usemin',
    'copy:dist',
    //'replace:dist',

  ]);

};