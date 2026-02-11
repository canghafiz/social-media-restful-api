# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:
```json
{
  "email": "test@gmail.com",
  "firstName": "Hafiz",
  "lastName": "Rahman",
  "username" : "hafiz",
  "password": "123"
}
```

Response Body (Success):
```json
{
  "success": true,
  "code": 200,
  "data": {
    "token": "jwt_token_string",
    "payload": {
      "userId": 1,
      "token": "asdadacxasc"
    }
  }
}

```

Response Body (Failed):
```json
{
  "success": false,
  "code": 400,
  "data": "username already registered"
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:
```json
{
  "username" : "hafiz",
  "password": "123"
}
```

Response Body (Success):
```json
{
  "success": true,
  "code": 200,
  "data": {
    "token": "jwt_token_string",
    "payload": {
      "userId": 1,
      "token": "asdadacxasc"
    }
  }
}
```

Response Body (Failed):
```json
{
  "success": false,
  "code": 404,
  "data": "user not found"
}
```