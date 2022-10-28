# Setups
1. Create a ".env" file in the project's root directory
    ```
        PORT=5000
        POSTGRES_PASS='changeThisPassword'
    ```
2. Start up dockers by running the following commands in the project's root directory
    ```
        # docker compose --env-file .env up --build
    ```
## Docker Commands 
```
    # docker compose --env-file .env up --build   // use to start the dockers
    # docker compose down          // use to stop the dockers 
    # docker ps         // use to get active docker name
    # docker exec -it \<docker name\> sh    // use to access docker shell 
```
# APIs
## User related APIs
1. Default path 
    ```
        /api/user
    ```
2. Login API (POST)
    ```
        /api/user/login
    ```
    ```
        {
            'email': 'test@gmail.com',
            'password': 'password@12345'
        }
    ```
3. Signup API (POST)
    ```
        /api/user/login
    ```
    ```
        {
            'email': 'test@gmail.com',
            'username', 'test',
            'password': 'password@12345',
            'confirm_password': 'password@12345' 
        }
    ```
## Crypto related APIs
1. Default path 
    ```
        /api/crypto
    ```

## Exchange related APIs
1. Default path 
    ```
        /api/exchange
    ```
2. Get crypto list (GET)
    ```
        /api/exchange/cryptoList
    ```
3. Get crypto detail (POST)
    ```
        /cryptoDetail
    ```
    ```
        {
            'cryptoId': 'bitcoin'
        }
    ```

## News related APIs
1. Default path 
    ```
        /api/news
    ```

# Generate Self-Signed Cert for HTTPs (Additional)
```
    # openssl genrsa -out key.pem
    # openssl req -new -key key.pem -out csr.pem
    # openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem   

    ### Reference ###
    https://adamtheautomator.com/https-nodejs/
```

