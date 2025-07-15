#!/bin/bash

# AWS 배포 스크립트

echo "=== Simple Board Backend 배포 시작 ==="

# 1. 프로젝트 빌드
echo "1. 프로젝트 빌드 중..."
./gradlew clean build -x test

# 2. Docker 이미지 빌드
echo "2. Docker 이미지 빌드 중..."
docker build -t simple-board-backend .

# 3. AWS ECR 로그인 (AWS CLI 필요)
echo "3. AWS ECR 로그인 중..."
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.ap-northeast-2.amazonaws.com

# 4. ECR 리포지토리 태그
echo "4. ECR 리포지토리 태그 중..."
docker tag simple-board-backend:latest your-account-id.dkr.ecr.ap-northeast-2.amazonaws.com/simple-board-backend:latest

# 5. ECR에 푸시
echo "5. ECR에 푸시 중..."
docker push your-account-id.dkr.ecr.ap-northeast-2.amazonaws.com/simple-board-backend:latest

# 6. ECS 서비스 업데이트 (ECS CLI 필요)
echo "6. ECS 서비스 업데이트 중..."
aws ecs update-service --cluster simple-board-cluster --service simple-board-service --force-new-deployment

echo "=== 배포 완료 ==="
echo "배포된 서비스 URL: http://your-domain.com:10000/api" 