#!/usr/bin/env bash
# init project and enable apis
echo "This script assumes that you have npm and gcloud already installed. We will first install your new project init your project."

npm install

gcloud init
export PROJECT=$(gcloud info --format='value(config.project)')
gcloud services enable firebase.googleapis.com
gcloud services enable cloudbuild.googleapis.com

export SERVICE_ACC='appengine-firestore'

gcloud iam service-accounts create $SERVICE_ACC

gcloud projects add-iam-policy-binding $PROJECT --member="serviceAccount:$SERVICE_ACC@$PROJECT.iam.gserviceaccount.com" --role="roles/owner"

gcloud iam service-accounts keys create firestore.json --iam-account=$SERVICE_ACC@$PROJECT.iam.gserviceaccount.com

# this project is set up so when deploying to appengine you are only deploying
# the /dist folder which is the output of the build folder.
# thus you must always build before deploy.
npm run build:ssr
gcloud app deploy
