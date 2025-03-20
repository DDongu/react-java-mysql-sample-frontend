#!/bin/bash
# 기존 컨테이너 중지 및 삭제
docker stop my-react-app-1 || true
# docker stop my-react-app-2 || true
docker rm my-react-app-1 || true
# docker rm my-react-app-2 || true
docker rmi $(docker images -q) || true
