const express = require('express');

const { 
        getBootcamps,
        getBootcamp,
        updateBootcamps,
        createBootcamps,
        deleteBootcamps,
        getBootcampsInRadius,
        bootcampPhotoUpload

} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Includes other resource router
const courseRouter  = require('./courses')

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/:id/photo').put(bootcampPhotoUpload)

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(createBootcamps)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamps)
    .delete(deleteBootcamps)
    


module.exports = router;