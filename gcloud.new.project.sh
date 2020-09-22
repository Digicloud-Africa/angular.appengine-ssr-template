#!/usr/bin/env bash
#init project and enable apis
echo "This script assumes that you have npm and gcloud already installed. We will first install your new project init your project."

npm install

gcloud init
export PROJECT=$(gcloud info --format='value(config.project)')
gcloud services enable firebase.googleapis.com

#create service accounts and access tokens
#read -p "We will now create a Service Account for Firestore. \n Please enter your service account's name : " service_account_name
#gcloud iam service-accounts create $service_account_name
#gcloud projects add-iam-policy-binding $PROJECT --member "serviceAccount:$service_account_name@$PROJECT.iam.gserviceaccount.com" --role "roles/owner"
#
#read -p "We will now create a Firestore key file for your service account and write it to your src/environments folder. \n Please enter this key file's name (eg: firestore_prod_key): " keyfile
#gcloud iam service-accounts keys create ./src/environments/$keyfile.json --iam-account $service_account_name@$PROJECT.iam.gserviceaccount.com
#
#
#export GOOGLE_APPLICATION_CREDENTIALS="./src/environments/$keyfile.json"

npm run ng add @angular/fire

