const {Trail, TrailCheckList, Version} = require('../sequelize');
const express = require('express');
const router = express.Router();

// get updated info from db
router.get('/:version',async function(req,res){
    try{
        // get user current version
        const v = req.params.version;
        // get db current version
        const r = await Version.findOne({
            attributes: [
                'db_version'
            ],
            where: {
                id: 1
            }
        });
        // check if data retrieved worked
        if(r == null)
        {
            return res.json({
                'success': false,
                'error': 'cant retrieve database version'
            });
        }
        // print data for debugging
        console.log("r = ");
        console.log(r);
        console.log("db_Version = ");
        console.log(r.db_version);
        //const old_v = '1.0.0';
        // versions match
        if (r.db_version === v){
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
                    'image_URL2',
                    'image_URL3',
                    'image_URL4',
                    'image_URL5',
                    'audio_URL',
                    'name',
                    'description',
                    'mileage',
                    'rating',
                    'is_wheelchair_accessible',
                    'id'
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
                    'new_version': r.db_version,
                    // encode trail data and send it
                    'trail_data': trails
                });
            }
        }
    }catch(err){
        console.log("error: ");
        console.log(err);
        return res.json({
            'success': false,
            'error': err
        });
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
