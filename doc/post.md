# Post API Spec

## Add Post

Endpoint: POST /api/posts
Authorization: Bearer <jwt_string_token>

Request Body:
```json
{
  "post_text": "Good morning!",
  "visibility": "publish"
}
```

Response Body (Success):
```json
{
  "success": true,
  "code": 200,
  "data": "your status successfully added"
}

```

Response Body (Failed):
```json
{
  "success": false,
  "code": 400,
  "data": "failed to add status"
}
```

## Read Posts (All)

Endpoint: GET /api/posts
Authorization: Bearer <jwt_string_token>

Response Body (Success):
```json
{
  "success": true,
  "code": 200,
  "data": [
    {
      "postId": 123,
      "post_text": "Good morning!",
      "visibility": "publish",
      "user_id": 1
    },
    {
      "postId": 124,
      "post_text": "Hello world!",
      "visibility": "publish",
      "user_id": 2
    }
  ]
}
```

## Read Posts by User

Endpoint: GET /api/posts/user/:userId
Authorization: Bearer <jwt_string_token>

Response Body (Success):
```json
{
  "success": true,
  "code": 200,
  "data": [
    {
      "postId": 123,
      "post_text": "Good morning!",
      "visibility": "publish",
      "user_id": 1
    }
  ]
}
```

## Update Post

Endpoint: POST /api/posts/:post_id
Authorization: Bearer <jwt_string_token>

Request Body:
```json
{
  "post_text": "Updated text",
  "visibility": "archive"
}
```

Response Body (Success):
```json
{
  "success": true,
  "code": 200,
  "data": {
    "postId": 123,
    "post_text": "Updated text",
    "visibility": "draft",
    "user_id": 1
  }
}
```

Response Body (Failed):
```json
{
  "success": false,
  "code": 400,
  "data": "failed to update post"
}
```

## Delete Post

Endpoint: POST /api/posts/:post_id
Authorization: Bearer <jwt_string_token>

Response Body (Success):
```json
{
  "success": true,
  "code": 200,
  "data": "post successfully deleted"
}
```

Response Body (Failed):
```json
{
  "success": false,
  "code": 400,
  "data": "failed to delete post"
}
```