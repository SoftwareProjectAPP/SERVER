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

/*
    To operate database:
    1. use left tab and navigate to SQL
    2. select trailblazerinstance
    3. open cloud shell
    4. press enter and wait
    5. when prompted for password use password "password"
    6. run command "show databases;" without ""
    7. run command "select trailblazerdb;" without ""
    8. examina tables using the command "show tables;" without ""
    9. examine specific table by using command "describe <tablename>" replace <tablename> with the name of the table and remove ""
    10. if trailchecklists has the columns "createdAt" and "updatedAt" then delete them
    11. add data to each fields
    
    To delete columns:
    run the command "alter table <tablename> drop column <column name>" 
    replace <tablename> with table name
    replace <column name> with the column name to remove

    To add data to table:
    run the command "INSERT INTO <tablename>(<list of columnns>) VALUES(<list of values>);"
    replace <tablename> for the name of the table
    replace <list of columns> with the column names separated by a comma
    replace <list of values> with the values separated by a comma
    order must match the order in list of columns
*/
