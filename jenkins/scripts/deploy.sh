#!/bin/bash
docker stop oeyteam-server && docker rm oeyteam-server
echo  "Docker stop & rm container ...."
docker run -d --name oeyteam-server --restart always -p 7000:7000 -p 7001:7001 --link mongod:mongodb --link redis:redis-db oeyteam-server:v1