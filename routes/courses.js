const express = require('express');

const { 
       getCourses,
       getCourse,
       addCourse,
       updateCourse,
       deleteCourse
} = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/').get( advancedResults(Course, 'bootcamps'), getCourses);
router.route('/:id').get(getCourse);
router.route('/').post(addCourse);
router.route('/:id').put(updateCourse);
router.route('/:id').delete(deleteCourse);

module.exports = router;
