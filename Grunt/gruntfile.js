module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
       },
      dist: {
        src: ['src/js/*.js'],
        dest: 'src/main-js/custom.js'
      }
    },
  uglify: {
        dist: {
          src: ['src/main-js/custom.js'],
          dest: 'js/script.min.js'
        }
  },
  copy: {
	    main: {
	      files: [
		      {expand: true, flatten: true, src: ['src/plugins/ie8/*'], dest: 'js/ie8/', filter: 'isFile'},
		      {expand: true, flatten: true, src: ['src/plugins/*'], dest: 'js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/fonts/*'], dest: 'fonts/', filter: 'isFile'}
	    	],
	  	},
  },
  sass: {
        dist: {
          options: {
            style: 'compressed'
          },
          files: [{
            expand: true,
            cwd: 'src/scss',
            src: ['*.scss'],
            dest: 'src/css',
            ext: '.css'
          }]
        },
        ie8: {
          options: {
            style: 'compressed'
          },
          files: [{
            expand: true,
            cwd: 'src/scss/ie8',
            src: ['*.scss'],
            dest: './src/ie8',
            ext: '.css'
          }]
        }
    },
  concat_css: {
      options: {},
      all: {
        src: ["src/css/*.css"],
        dest: "./css/main.css"
      },
      ie8: {
        src: ["src/ie8/*.css"],
        dest: "./css/ie8.css"
      }
    },
  imagemin: {
        dynamic: {
            files: [{
                expand: true,
                cwd: 'src/img/',
                src: ['**/*.{png,jpg,gif,svg}'],
                dest: './img'
            }]
        }
    },
  sprite:{
      all:{
        src: 'src/sprites/*.png',
        dest: 'src/img/sprite-file.png',
        destCss: 'src/ie8/sprite-file.css',
        algorithm: 'left-right'
       }
    },
  svg_sprite      : {
        options     : {
            log: 'info'
        },
        your_target : {
            expand      : true,
            cwd         : 'src/svg',
            src         : ['**/n*.svg'],
            dest        : './src',
            options     : {
                mode            : {
                    css        : {     // Activate the «css» mode
                        bust    : false,
                        layout: 'horizontal',
                        sprite: '../img/sprite.svg',
                        render  : {
                          css   : true  // Activate CSS output (with default options)
                        }
                    }
                }
            }
        },
    },
    watch: {
        sass: {
          // We watch and compile sass files as normal but don't live reload here
          files: ['src/scss/*.scss'],
          tasks: ['sass', 'concat_css'],
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-svg-sprite');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-imagemin');


  grunt.registerTask('default', ['concat', 'uglify', 'copy' , 'sass', 'sprite', 'svg_sprite', 'concat_css', 'imagemin']);

};

// grunt.registerTask('default', ['sass', 'concat_css']);


