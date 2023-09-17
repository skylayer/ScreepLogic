module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        concat: {
            options: {
                banner: 'module.exports = ',
                footer: ';'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['*.map'],
                    dest: 'dist/',
                    rename: function (dest, src) {
                        return dest + src.replace('.js.map', '.map.js');
                    }
                }]
            }
        },
        screeps: {
            options: {
                email: process.env.SCREEPS_EMAIL,       // Use the SCREEPS_EMAIL environment variable
                token: process.env.SCREEPS_AUTH_TOKEN,  // Use the SCREEPS_AUTH_TOKEN environment variable
                branch: 'main',
                server: 'main'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['*.js'],
                }]
            }
        }
    });

    grunt.registerTask('default', ['concat', 'screeps']);
}
