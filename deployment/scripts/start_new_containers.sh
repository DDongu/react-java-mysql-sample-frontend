#!/bin/bash
# 최신 Docker 이미지 가져오기
docker pull ddongu/my-react-app:latest

# 새로운 컨테이너 2개 실행 (포트 3000, 3001)
docker run --env-file /home/ec2-user/.env -d -p 3000:3000 --name my-react-app ddongu/my-react-app:latest
# docker run -d -p 3000:3000 --name my-react-app-2 my-docker-hub-username/my-react-app:latest 

