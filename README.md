# Guesty Batch Editing service

## Required headers
In order to use service user should pass header: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGltYSIsImlhdCI6MTU0MjAyNjY4Nn0.K2UEldOFGUFLzE4-fL0z-GmHz3tv1xwp7YWgMeNneYY`.

JWT was signed for 300 hours from 12 November.

## Endpoint example
Requests should go to `<host>/batch`. HTTP method is POST

```{
  "endpoint": {
    "verb": "PUT",
    "url": "https://guesty-user-service.herokuapp.com/user"
  },
  "payload": {
    "params": [
      {
        "userId": "ja2S-hs81-ksn3-iQI9"
      },
      {
        "userId": 29
      },
      {
        "userId":103
       }
    ],
    "requestBody": {
      "age": 30
    }
  }
}
```
NOTE: Rate limit works only with GET requests (decreasing X-Ratelimit-Remaining), but with PUT requests X-Ratelimit-Remaining does not decrease and stays always number 4. Since batch service has inconsistent number of requests (requests to batch service and user service differs), so I thought to make a queue to collect requests for further processing if 429 code is appeared. 
