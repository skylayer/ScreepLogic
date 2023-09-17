module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: '<e-mail>',
                token: '<auth token>',
                branch: 'main',
                server: 'main'
            },
            dist: {
                src: ['dist/*.js', 'dist/*.js.map']
            }
        }
    });
}