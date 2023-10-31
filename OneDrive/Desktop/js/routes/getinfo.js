const {Trail, TrailCheckList} = require('../sequelize');
const express = require('express');
const router = express.Router();

// get updated info from db
router.get('/:version',async function(req,res){
    // get user current version
    const v = req.params.version;
    // get db current version
    const old_v = '1.0.0';
    // versions match
    if (old_v === v){
        res.json({
            'success': true,
            'current_version': true
        });
    // versions dont match
    }else{
        // get all trail information
        const trails = await Trail.findAll({
            attributes: [
                'image_URL',
                'audio_URL',
                'name',
                'description',
                'mileage',
                'rating',
                'is_wheelchair_accessible',
            ],
            include: [{
                model: TrailCheckList,
                attributes: [
                    'item'
                ]
            }]
        });
        // no trail information found
        if(trails.length === 0){
            res.json({
                'success': false,
                'error': 'trails not found'
            });
        // trail information found
        }else{
            res.json({
                'success': true,
                'current_version': false,
                'new_version': old_v,
                // encode trail data and send it
                'trail_data': trails
            });
        }
    }
});

module.exports = router;
