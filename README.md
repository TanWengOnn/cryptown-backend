# Commands 
```
    # docker compose --env-file .env up --build   // use to start the dockers
    # docker compose down          // use to stop the dockers 
    # docker ps         // use to get active docker name
    # docker exec -it \<docker name\> sh    // use to access docker shell 
```
## Generate Self-Signed Cert for HTTPs
```
    # openssl genrsa -out key.pem
    # openssl req -new -key key.pem -out csr.pem
    # openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem   

    ### Reference ###
    https://adamtheautomator.com/https-nodejs/
```