module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.initConfig({
        screeps: {
            options: {
                email: process.env.SCREEPS_EMAIL,       // Use the SCREEPS_EMAIL environment variable
                token: process.env.SCREEPS_AUTH_TOKEN,  // Use the SCREEPS_AUTH_TOKEN environment variable
                branch: 'main',
                server: 'main'
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['*.js'],
                    }
                ]
            }
        }
    });
}
