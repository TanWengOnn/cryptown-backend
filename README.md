# Cryptown
1. https://cryptown-besquare.one

## Setups
1. Create a ".env" file in the project's root directory
    ```
        PORT=5000
        POSTGRES_PASS='changeThisPassword'
    ```
2. Start up dockers by running the following commands in the project's root directory
    ```
        # docker compose --env-file .env up --build
    ```
### Docker Commands 
```
    # docker compose --env-file .env up --build   // use to start the dockers
    # docker compose down          // use to stop the dockers 
    # docker ps         // use to get active docker name
    # docker exec -it \<docker name\> sh    // use to access docker shell 
```

### Generate Self-Signed Cert for JWT (Additional)
```
    # openssl genrsa -out key.pem
    # openssl req -new -key key.pem -out csr.pem
    # openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem   

    ### Reference ###
    https://adamtheautomator.com/https-nodejs/
```

