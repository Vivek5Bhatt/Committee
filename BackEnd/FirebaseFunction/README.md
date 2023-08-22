# committee-cloud-functions
committee-cloud-functions

# Steps to set up the project on the local system: 

# To clone repository 
git clone 

# Create a .env 

Create a file inside the functions folder and put AUTHORIZATION_KEY variable in that. This token is used for "Firebase Cloud Messaging" authentication e.g AUTHORIZATION_KEY = "key=KEY_VALUE".

To get this key go to the firebase console->select project->project overview->project settings->cloud messaging and then generate "Cloud Messaging API key". 

# Create a serviceAccountKeys.json

Create a serviceAccountKeys.json file inside the functions folder.  To get this file go to the firebase console->select project->project overview->project settings->service account->click on generate new private key. Copy this key into serviceAccountKeys.json file. This file is used for firestore database connection.

# To install project dependencies

Inside functions folder run command:
npm install

# To deploy your function in firebase 
Inside function folder run command:
npm run deploy

This command will create or update function inside the firebase project 







