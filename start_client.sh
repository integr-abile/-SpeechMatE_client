export HOST_IP=$(ipconfig getifaddr en0)
./env.sh > env.js
docker run -dit --rm -p 8080:80 -v "$(pwd)":/usr/local/apache2/htdocs --name speech-service httpd
echo "Go to Chrome on localhost:8080 to begin speech!"
