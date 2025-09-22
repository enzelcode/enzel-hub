#!/bin/bash

# Deploy script for Enzel Hub
set -e

echo "🚀 Starting Enzel Hub deployment..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Run 'aws configure' first."
    exit 1
fi

# Variables
REGION="us-east-1"
BACKEND_SERVICE_NAME="enzel-hub-backend"
FRONTEND_APP_NAME="enzel-hub-frontend"
GITHUB_REPO_URL="https://github.com/enzelcode/enzel-hub.git"

echo "📋 Configuration:"
echo "   Region: $REGION"
echo "   Backend Service: $BACKEND_SERVICE_NAME"
echo "   Frontend App: $FRONTEND_APP_NAME"
echo ""

# Deploy Backend to App Runner
echo "🔧 Deploying backend to App Runner..."

# Create App Runner service
aws apprunner create-service \
    --service-name "$BACKEND_SERVICE_NAME" \
    --source-configuration '{
        "ImageRepository": {
            "ImageIdentifier": "public.ecr.aws/docker/library/node:18-alpine",
            "ImageConfiguration": {
                "Port": "3001"
            },
            "ImageRepositoryType": "ECR_PUBLIC"
        },
        "CodeRepository": {
            "RepositoryUrl": "'$GITHUB_REPO_URL'",
            "SourceCodeVersion": {
                "Type": "BRANCH",
                "Value": "main"
            },
            "CodeConfiguration": {
                "ConfigurationSource": "REPOSITORY",
                "CodeConfigurationValues": {
                    "Runtime": "NODEJS_18",
                    "BuildCommand": "cd backend && npm ci && npm run build",
                    "StartCommand": "cd backend && npm start",
                    "RuntimeEnvironmentVariables": {
                        "NODE_ENV": "production",
                        "PORT": "3001"
                    }
                }
            }
        },
        "AutoDeploymentsEnabled": true
    }' \
    --instance-configuration '{
        "Cpu": "0.25 vCPU",
        "Memory": "0.5 GB"
    }' \
    --region "$REGION"

echo "✅ App Runner service created!"

# Get App Runner service URL
echo "⏳ Waiting for service to be ready..."
sleep 30

SERVICE_URL=$(aws apprunner describe-service \
    --service-arn $(aws apprunner list-services --query "ServiceSummaryList[?ServiceName=='$BACKEND_SERVICE_NAME'].ServiceArn" --output text --region "$REGION") \
    --query 'Service.ServiceUrl' \
    --output text \
    --region "$REGION")

echo "🔗 Backend URL: https://$SERVICE_URL"

# Deploy Frontend to Amplify
echo "🎨 Setting up Amplify app..."

# Create Amplify app
AMPLIFY_APP_ID=$(aws amplify create-app \
    --name "$FRONTEND_APP_NAME" \
    --repository "$GITHUB_REPO_URL" \
    --platform "WEB" \
    --query 'app.appId' \
    --output text \
    --region "$REGION")

echo "📱 Amplify App ID: $AMPLIFY_APP_ID"

# Create main branch
aws amplify create-branch \
    --app-id "$AMPLIFY_APP_ID" \
    --branch-name "main" \
    --region "$REGION"

# Set environment variables
aws amplify update-app \
    --app-id "$AMPLIFY_APP_ID" \
    --environment-variables "NEXT_PUBLIC_API_URL=https://$SERVICE_URL" \
    --region "$REGION"

# Start deployment
aws amplify start-job \
    --app-id "$AMPLIFY_APP_ID" \
    --branch-name "main" \
    --job-type "RELEASE" \
    --region "$REGION"

echo "✅ Deployment started!"
echo ""
echo "🎉 Next steps:"
echo "1. Configure DNS for hub.enzelcode.com → Amplify"
echo "2. Configure DNS for hubapi.enzelcode.com → $SERVICE_URL"
echo "3. Wait for deployments to complete"
echo ""
echo "📊 Monitor progress:"
echo "   Backend: https://$REGION.console.aws.amazon.com/apprunner/home?region=$REGION#/services"
echo "   Frontend: https://$REGION.console.aws.amazon.com/amplify/home?region=$REGION#/$AMPLIFY_APP_ID"