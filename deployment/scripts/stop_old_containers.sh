#!/bin/bash
echo "기존 컨테이너 확인 및 정리"
# 임시 컨테이너(terraform 시작 템플릿) 중지 및 삭제
if [ "$(docker ps -q -f name=temp-nginx)" ]; then
    echo "임시 컨테이너(temp-nginx) 삭제"
    docker stop temp-nginx && docker rm temp-nginx
fi

# 기존 컨테이너 중지 및 삭제
docker stop my-react-app-1 || true
# docker stop my-react-app-2 || true
docker rm my-react-app-1 || true
# docker rm my-react-app-2 || true
docker rmi $(docker images -q) || true
