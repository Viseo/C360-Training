// Karma configuration
// Generated on Wed Mar 30 2016 18:48:25 GMT+0200 (Europe de l’Ouest (heure d’été))

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'src/main/webapp/lib/jquery.min.js',
            'src/main/webapp/lib/vue.js',
            'src/main/webapp/lib/vue-strap.js',
            'src/main/webapp/lib/vue-resource.js',
            'src/main/webapp/lib/vue-router.js',
            'src/main/webapp/lib/jwt-decode.js',
            'src/test/javaScript/spec/util/test-util.js',
            'src/main/webapp/app/controller/registerCollaborator.js',
            'src/main/webapp/app/controller/util/base.js',
            'src/main/webapp/app/controller/main.js',
            'src/main/webapp/app/controller/adminController/registerTrainingTopic.js',
            'src/main/webapp/app/controller/collabController/registerTrainingCollaborator.js',
            'src/main/webapp/app/controller/adminController/assignCollaborator.js',
            'src/main/webapp/app/controller/adminController/addSession.js',
            'src/main/webapp/app/controller/collabController/trainingToCome.js',
            'src/main/webapp/app/controller/collabController/wishToVote.js',
            'src/main/webapp/app/controller/adminController/collectWishes.js',
            'src/main/webapp/app/controller/profilToUpdate.js',
            'src/main/webapp/app/controller/resetPassword.js',
            'src/main/webapp/app/controller/adminController/stateRequestTraining.js',
            'src/main/webapp/app/controller/adminController/trainingRankingByOpinions.js',
            'src/test/javaScript/spec/mainSpec.js',
            'src/test/javaScript/spec/util/baseSpec.js',
            'src/test/javaScript/spec/registerCollaboratorSpec.js',
            'src/test/javaScript/spec/resetPasswordSpec.js',
            'src/test/javaScript/spec/adminSpec/registerTrainingTopicSpec.js',
            'src/test/javaScript/spec/collabSpec/registerTrainingCollaboratorSpec.js',
            'src/test/javaScript/spec/adminSpec/assignCollaboratorSpec.js',
            'src/test/javaScript/spec/collabSpec/trainingToComeSpec.js',
            'src/test/javaScript/spec/adminSpec/collectWishesSpec.js',
            'src/test/javaScript/spec/collabSpec/wishToVoteSpec.js',
            'src/test/javaScript/spec/collabSpec/stateRequestTrainingSpec.js',
            'src/test/javaScript/spec/profilToUpdateSpec.js',
            'src/test/javaScript/spec/adminSpec/trainingRankingByOpinionsSpec.js',
            'src/test/javaScript/spec/adminSpec/addSessionSpec.js',
        ],




        // list of files to exclude
        exclude: [

        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/main/webapp/app/controller/*.js':['coverage'],
            'src/main/webapp/app/controller/adminController/*.js':['coverage'],
            'src/main/webapp/app/controller/collabController/*.js':['coverage'],
            'src/main/webapp/app/controller/util/*.js':['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter

        reporters: ['progress','coverage'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing fake whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the fake and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
