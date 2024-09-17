# Bricksfi API endpoints

This is endpoints for brickfi

## User Registration (Sign Up)
Endpoint: /signup
Method: POST
Description: Registers a new user using their email, password, first_name, last_name and phone_no.
    Request
    POST /signup
        {
            "email": "example@example.com",
            "password": "your_password",
            "first_name": "Niyi",
            "last_name": "Tesla",
            "phone_no": "09121031921"
        }
    Response
        {
            "msg": "User registered successfully",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmU5YTgwNjU4OWFmNzRmMDljMjQ5YjIiLCJpYXQiOjE3MjY1ODg5MzQsImV4cCI6MTcyOTE4MDkzNH0.lRlSq_KJ6aROmOxVWaRAYADpEO5ALlYSG1gReZHUT8k",
            "user": {
                "email": "akinluaolorunfunminiyi@gmail.com",
                "password": "$2a$10$/SQcdeLOVJEIjDXaFw/0SuMTHovjwhAKYuJ.6tfp3nmsJRmtAefvO",
                "first_name": "Niyi",
                "last_name": "Tesla",
                "phone_no": "09121031921",
                "isVerified": false,
                "_id": "66e9a806589af74f09c249b2",
                "__v": 0
            }
        }

## User Login
Endpoint: /login
Method: POST
Description: Logs in an existing user with email and password, returning a JWT token.
    Request
    POST /login
        {
            "email": "example@example.com",
            "password": "your_password"
        }
    Response

        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmU5YTgwNjU4OWFmNzRmMDljMjQ5YjIiLCJpYXQiOjE3MjY1ODk3NDAsImV4cCI6MTcyOTE4MTc0MH0.J0JeErQjRXnCwutkcRmjFb_i-M_t5qFy4hTfWJEMpu8",
            "user": {
                "_id": "66e9a806589af74f09c249b2",
                "email": "akinluaolorunfunminiyi@gmail.com",
                "password": "$2a$10$FlbmMkMgnSDvVEtj0DEYI.QLRckrtCwut/kVxlB8F4jEMPbqd9Rym",
                "first_name": "Niyi",
                "last_name": "Tesla",
                "phone_no": "09121031921",
                "isVerified": false,
                "__v": 0,
                "resetCode": null
            },
            "msg": "User logged In Successfully"
        }
## Forgot Password
Endpoint: /forgot-password
Method: POST
Description: Sends a password reset code to the user's email.
    Request
    POST /forgot-password
        {
            "email": "example@example.com"
        }
    Response    
        {
            "msg": 'Reset code sent to email' 
        }

## Verify Reset Code
Endpoint: /verify-code
Method: POST
Description: Verifies the password reset code sent to the user's email.

    Request
    POST /verify-code
        {
            "email": "example@example.com",
            "code": "1234"
        }
    Response
        {
            "msg": 'Code verified. You can now reset your password'
        }

## Reset Password
Endpoint: /reset-password
Method: POST
Description: Resets the user's password after successful code verification.

    Request
    POST /reset-password
        {
            "email": "example@example.com",
            "password": "new_password"
        }
    Response
        {
            "msg": "Password reset successfully"
        }
        

## Error handler
400
500

With Response  like
{
    "msg": 'error message'
}

at times could have the error name
{
    "msg": 'error message'
    "error": "err name"
}