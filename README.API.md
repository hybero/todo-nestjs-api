## Public

### Request
#### POST - `http://localhost:3333/auth/register`
#### Body
    {
        "email": "john77@email.com",
        "password": "john123"
    }
### Response
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9objc3QGVtYWlsLmNvbSIsImlhdCI6MTY5ODA0OTEyNCwiZXhwIjoxNjk4MDUwMDI0fQ.sbSQAHz8QneCMBk0bBeojCbwdxiqRSp3DXyVyv_jVJs",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9objc3QGVtYWlsLmNvbSIsImlhdCI6MTY5ODA0OTEyNCwiZXhwIjoxNjk4NjUzOTI0fQ.GvpOGP-MTuS0up2MM1B2Llq3HPTRfVzLhHvO3alrl-g"
    }

### Request
#### POST - `http://localhost:3333/auth/login`
#### Body
    {
        "email": "john77@email.com",
        "password": "john123"
    }
### Response
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9objc3QGVtYWlsLmNvbSIsImlhdCI6MTY5ODA0OTEyNCwiZXhwIjoxNjk4MDUwMDI0fQ.sbSQAHz8QneCMBk0bBeojCbwdxiqRSp3DXyVyv_jVJs",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9objc3QGVtYWlsLmNvbSIsImlhdCI6MTY5ODA0OTEyNCwiZXhwIjoxNjk4NjUzOTI0fQ.GvpOGP-MTuS0up2MM1B2Llq3HPTRfVzLhHvO3alrl-g"
    }

## Auth
### Request
#### POST - `http://localhost:3333/auth/logout`
#### Headers
    Authorization: Bearer {access_token}
### Response
#### Headers
    Status 204 No Content

### Request
#### POST - `http://localhost:3333/auth/refresh`
#### Headers
    Authorization: Bearer {refresh_token}
### Response
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9objc3QGVtYWlsLmNvbSIsImlhdCI6MTY5ODA0OTU0NywiZXhwIjoxNjk4MDUwNDQ3fQ._gFlnKN1b7ySNvLN4Qm5w790g6FB4777BxiqWLLCgMQ",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9objc3QGVtYWlsLmNvbSIsImlhdCI6MTY5ODA0OTU0NywiZXhwIjoxNjk4NjU0MzQ3fQ.RlfvTTmCN0Oh8sgJzI5rdde6uAOz9wqIvvDDU2dkKrA"
    }

## Users
### Request
#### GET - `http://localhost:3333/users/me`
#### Headers
    Authorization: Bearer {access_token}
### Response
    {
        "sub": 1,
        "email": "john77@email.com",
        "iat": 1698049547,
        "exp": 1698050447
    }

## Lists
### Request
#### POST - `http://localhost:3333/lists`
#### Headers
    Authorization: Bearer {access_token}
#### Body
    {
        "title": "list1",
        "description": "desc1" 
    }
### Response
    {
        "id": 1,
        "createdAt": "2023-10-23T08:34:40.260Z",
        "updatedAt": "2023-10-23T08:34:40.260Z",
        "title": "list1",
        "description": "desc1",
        "users": [
            {
                "id": 1,
                "createdAt": "2023-10-23T08:18:44.174Z",
                "updatedAt": "2023-10-23T08:25:47.997Z",
                "email": "john77@email.com",
                "firstName": null,
                "lastName": null
            }
        ]
    }

### Request
#### GET - `http://localhost:3333/lists`
### Response
    {
        "id": 1,
        "createdAt": "2023-10-23T08:34:40.260Z",
        "updatedAt": "2023-10-23T08:34:40.260Z",
        "title": "list1",
        "description": "desc1",
        "users": [
            {
                "id": 1,
                "createdAt": "2023-10-23T08:18:44.174Z",
                "updatedAt": "2023-10-23T08:25:47.997Z",
                "email": "john77@email.com",
                "firstName": null,
                "lastName": null
            }
        ],
        "tasks": [
            {
                "id": 2,
                "createdAt": "2023-10-23T08:57:13.639Z",
                "updatedAt": "2023-10-23T08:57:13.639Z",
                "listId": 1,
                "userId": 1,
                "title": "task1",
                "description": "desc1",
                "flag": "active",
                "deadline": "2023-11-28T13:34:55.897Z",
                "user": {
                    "id": 1,
                    "createdAt": "2023-10-23T08:18:44.174Z",
                    "updatedAt": "2023-10-23T08:54:15.872Z",
                    "email": "john77@email.com",
                    "firstName": null,
                    "lastName": null
                }
            }
        ]
    }

### Request
#### POST - `http://localhost:3333/lists/share`
#### Headers
    Authorization: Bearer {access_token}
#### Body
    {
        "userId": "2",
        "listId": "1" 
    }
### Response
    {
        "id": 1,
        "createdAt": "2023-10-23T08:34:40.260Z",
        "updatedAt": "2023-10-23T08:34:40.260Z",
        "title": "list1",
        "description": "desc1",
        "users": [
            {
                "id": 1,
                "createdAt": "2023-10-23T08:18:44.174Z",
                "updatedAt": "2023-10-23T08:25:47.997Z",
                "email": "john77@email.com",
                "firstName": null,
                "lastName": null
            },
            {
                "id": 2,
                "createdAt": "2023-10-23T08:36:34.899Z",
                "updatedAt": "2023-10-23T08:36:35.105Z",
                "email": "adam77@email.com",
                "firstName": null,
                "lastName": null
            }
        ],
        "tasks": []
    }

### Request
#### GET - `http://localhost:3333/lists/my`
#### Headers
    Authorization: Bearer {access_token}
### Response
    [
        {
            "id": 1,
            "createdAt": "2023-10-23T08:34:40.260Z",
            "updatedAt": "2023-10-23T08:34:40.260Z",
            "title": "list1",
            "description": "desc1",
            "tasks": []
        },
        {
            "id": 2,
            "createdAt": "2023-10-23T08:36:54.701Z",
            "updatedAt": "2023-10-23T08:36:54.701Z",
            "title": "list2",
            "description": "desc2",
            "tasks": []
        }
    ]

## Tasks
### Request
#### Post - `http://localhost:3333/tasks`
#### Headers
    Authorization: Bearer {access_token}
#### Body
    {
        "title": "title1",
        "description": "description1",
        "listId": "1",
        "deadline": "2023-11-28T13:34:55.897Z" 
    }
### Response
    {
        "id": 1,
        "createdAt": "2023-10-23T08:56:26.352Z",
        "updatedAt": "2023-10-23T08:56:26.352Z",
        "listId": 1,
        "userId": 1,
        "title": "task1",
        "description": "desc1",
        "flag": "active",
        "deadline": "2023-11-28T13:34:55.897Z",
        "list": {
            "id": 1,
            "createdAt": "2023-10-23T08:34:40.260Z",
            "updatedAt": "2023-10-23T08:34:40.260Z",
            "title": "list1",
            "description": "desc1"
        },
        "user": {
            "id": 1,
            "createdAt": "2023-10-23T08:18:44.174Z",
            "updatedAt": "2023-10-23T08:54:15.872Z",
            "email": "john77@email.com",
            "firstName": null,
            "lastName": null
        }
    }

### Request
#### Post - `http://localhost:3333/tasks/1/changeflag`
#### Headers
    Authorization: Bearer {access_token}
#### Body
    {
        "flag": "cancelled" 
    }
### Response
    {
        "id": 1,
        "createdAt": "2023-10-23T08:56:26.352Z",
        "updatedAt": "2023-10-23T08:58:48.658Z",
        "listId": 1,
        "userId": 1,
        "title": "task1",
        "description": "desc1",
        "flag": "cancelled",
        "deadline": "2023-11-28T13:34:55.897Z"
    }