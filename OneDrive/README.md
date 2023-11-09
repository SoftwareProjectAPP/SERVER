# API Endpoints

## achievements endpoint

### Get all achivements

- ENDPOINT: /api/achievements/getall

- METHOD: GET

- Purpose:
&emsp; Get all achievements

- Request:
&emsp; JWT token passed as header

- Response:


    JSON {
        
        success:
            boolean flag that determines if request succeeded or failed

        error:
            only included if success is false
            string that contains error message

        achievements:
            array of JSON objects that has the following format:
                title:
                    string that describes name of achivement
    }

# add achievement
- ENDPOINT: /api/achievements/add

- METHOD: POST

- Purpose:
&emsp; Add achievement for user

- Request:

    - JWT token passed as header
    
    - achievement_id:
    &emsp; integer that describes achievement id

- Response:


    JSON{
        success:
            boolean flag that determines if request worked or failed

        error:
            only included if success is false
            string that describes error message
    }

# authentication endpoints

# register

- ENDPOINT: /api/authenticate/register

- METHOD: POST

- Purpose:
&emsp; register user

- Request:

    
    JSON{
        email:
            string that describes email
            
        password:
            string that describes confirmed password

        first_name:
            string that describes first name

        last_name:
            string that describes last name

        question1:
            string that describes security question 1

        question2:
            string that describes security question 2

        answer1:
            string that describes security answer 1

        answer2:
            string that describes security answer 2
    }

- Response:
    

    JSON{
        success:
            boolean flag that determines if request worked or not

        error:
            only included if success is failed
            string that describes error message
    }

# login

- ENDPOINT: /api/authenticate/login

- METHOD: POST

- Purpose:
&emsp; login user

- Request:
    

    JSON{
        email:
            string that describes email

        password:
            string that describes confirmed password
    }

- Response:
    

    JSON{
        success:
            boolean flag that determines if request worked or not

        error:
            only included if success is failed
            string that describes error message

        token:
            only included if success is true
            string that contains user token

        user_id:
            only included if success is true
            string that contains user id
    }

# check if security question answers are correct
- ENDPOINT: /api/authenticate/forgot/change

- METHOD: POST

- Purpose:
&emsp; check if answers are correct

- Request:
    

    JSON{
        email:
            string that describes email

        answer1:
            string that describes answer to security question 1

        answer2:
            string that describes answer to security question 2

        password:
            string that contains new password
    }

- Response:
    

    JSON{
        success:
            boolean flag that determines if request worked or not

        error:
            only included if success is failed
            string that describes error message
    }


# get security questions for user

- ENDPOINT: /api/authenticate/forgot

- METHOD: POST

- Purpose:
&emsp; get security questions for user

- Request:
    

    JSON{
        email:
            string that describes email
    }

- Response:
    

    JSON{
        success:
            boolean flag that determines if request worked or not

        error:
            only included if success is failed
            string that describes error message

        security_question1:
            only included if success is true
            string that describes security question 1

        security_question2:
            only included if success is true
            string that describes security question 2
    }

# logout

- ENDPOINT: /api/authenticate/logout

- METHOD: POST

- Purpose:
&emsp; logout user

- Request:
    &emsp; JSON web token

- Response:
    

    JSON{
        success:
            boolean flag that determines if request worked or not

        error:
            only included if success is failed
            string that describes error message
    }

# get info endpoint

- ENDPOINT: /api/getinfo/:version

- METHOD: GET

- Purpose:
&emsp; Get all trail information if version doesnt match server version

- Request:
    
    - version:
        &emsp; version number passed as parameter in URL
        &emsp; example version: 1.0.0

- Response:
    

    JSON{
        success:
            boolean flag which determines if it worked or not

        error:
            only included if error is false
            error message to show user

        current_version:
            included if success is true
            boolean flag that determines if client version matches server version

        new_version:
            included if success is true and current version is false
            string that contains server version id
            used by client to update their version

        trail_data:
            included if success is ture and current version is false
            array of JSON objects that matches the following format:
                image_URL:
                    string that contains image url

                audio_URL:
                    string that contains audio url

                name:
                    string that contains name of trail
                
                description:
                    string that contains description of trail

                mileage:
                    float that contains length of trail

                rating:
                    integer that describes rating of trail from 1-5

                is_wheelchair_accessible:
                    boolean flag that determines if a path is wheelchair accessible or not

                trail_check_list:
                    array of JSON objects that matches following format:

                        item:
                            string that describes the item checklist
    }