#!/usr/bin/env bash
# init project and enable apis
echo "This script assumes that you have npm and gcloud already installed. We will first init your Google Cloud project."

gcloud init
export PROJECT=$(gcloud info --format='value(config.project)')

#enable firestore
gcloud services enable firebase.googleapis.com

#appengine
gcloud app create --project=$PROJECT
gcloud services enable cloudbuild.googleapis.com

gcloud iam service-accounts keys create src/environments/firestore.json --iam-account=$PROJECT@$PROJECT.iam.gserviceaccount.com

#replace the contents of these files to get different connection environments
cp src/environments/firestore.json src/environments/firestore.prod.json
echo "Now we will install build and deploy this codebase."
# this project is set up so when deploying to appengine you are only deploying
# the /dist folder which is the output of the build folder.
# thus you must always build before deploy.
npm install
npm run build:protos
npm run build:ssr
gcloud app deploy
