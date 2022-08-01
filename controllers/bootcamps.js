const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middleware/async')



// desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler (async (req, res, next) => {  
        res.status(200).json(res.advancedResults);

})

// desc Get a single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {

    

        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return next((new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 400)))
        }

             res.status(200).json({ success: true, data: bootcamp})



});

// desc Create new bootcamps
// @route POST /api/v1/bootcamps
// @access Private

exports.createBootcamps = asyncHandler(async(req, res, next) => {
 
     const bootcamp = await Bootcamp.create(req.body);


    res.status(201).json({ 
    success: true,
    data: bootcamp
    })
 
 });



// desc Update bootcamps
// @route PUT /api/v1/bootcamps/:id
// @access Private

exports.updateBootcamps = asyncHandler(async (req, res, next) => {

         const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!bootcamp){
        return next((new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 400)))
    }

    res.status(200).json({ success: true,  data: bootcamp})
   
});
 
// desc Delete bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Private

exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    
   
         const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next((new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 400)))
    }

    bootcamp.remove();

    res.status(200).json({ success: true,  data: {}})
   
});
 


// desc Get bootcamps within the radius
// @route GET /api/v1/bootcamps/radius/:zipcodes/:distance
// @access Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    
   const { zipcode, distance} = req.params;

//    Get lat/lng from geocoder
        const loc  = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

//  Calc radius using radius
        // Divide dist by radius of the earth
        // Earth Radius = 3,963 mi/ 6,378km
    
        const radius  = distance / 3963;

        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [[ lng, lat], radius]}}
        })

        res.status(200).json({ 
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })
});

// desc Upload Photo
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    
   
         const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next((new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 400)))
    }

    if(!req.files){
       return next((new ErrorResponse(`Please Upload a file`, 400)))

    }

    const file  = req.files.file;

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
         return next((new ErrorResponse(`Please Upload an image file`, 400)))

    }
   

    // Check File Size
    if(file.size > process.env.MAX_FILE_UPLOAD){
         return next((new ErrorResponse(`Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)))
    }

    // Create Custom FileName
     file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    //  Upload The file Here
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);

          return next((new ErrorResponse(`Problem with file upload`, 400)))
   

        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({
            sucess: true,
            data: file.name
        })
    });

    console.log(file.name);

});
 