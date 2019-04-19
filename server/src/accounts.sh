#!/bin/bash

# Create an admin account first
set -x
curl -X POST \
  http://localhost:8000/signup \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: bdcdd575-140b-4778-99a5-10ba99ecf8cf' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "admin@iitk.ac.in",
	"password": "admin"
}'

curl -X POST \
  http://localhost:8000/updateAuthLevel \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 37ca0368-e0a3-489b-b85c-72280e9b1ad0' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "admin@iitk.ac.in",
	"authLevel": "14"
}'


curl -X POST \
  http://localhost:8000/signup \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: bdcdd575-140b-4778-99a5-10ba99ecf8cf' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "police@iitk.ac.in",
	"password": "police"
}'

curl -X POST \
  http://localhost:8000/updateAuthLevel \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 37ca0368-e0a3-489b-b85c-72280e9b1ad0' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "police@iitk.ac.in",
	"authLevel": "4"
}'
curl -X POST \
  http://localhost:8000/signup \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: bdcdd575-140b-4778-99a5-10ba99ecf8cf' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "rto@iitk.ac.in",
	"password": "rto"
}'

curl -X POST \
  http://localhost:8000/updateAuthLevel \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 37ca0368-e0a3-489b-b85c-72280e9b1ad0' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "rto@iitk.ac.in",
	"authLevel": "2"
}'
curl -X POST \
  http://localhost:8000/signup \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: bdcdd575-140b-4778-99a5-10ba99ecf8cf' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "citizen@iitk.ac.in",
	"password": "citizen"
}'

curl -X POST \
  http://localhost:8000/updateAuthLevel \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 37ca0368-e0a3-489b-b85c-72280e9b1ad0' \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "citizen@iitk.ac.in",
	"authLevel": "8"
}'
