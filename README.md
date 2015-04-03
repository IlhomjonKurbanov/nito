# Nito

Nito is a prototype of a human/machine hybrid remote proctoring system. It is created as part of the 05-571 Undergraduate Project in HCI at Carnegie Mellon University

## Running the application

To run the application, clone the repository:
```
git clone git@github.com:arthuralee/nito.git
```

Navigate to the root directory of the project, and run the following command to download prerequisites
```
npm install
```
Run the development server
```
npm start
```
The development server should be running on port `8080`

## Developing
To develop, you need slightly different commands.
clone the repository:
```
git clone git@github.com:arthuralee/nito.git
```

Navigate to the root directory of the project, and run the following command to download prerequisites, including the development prerequisites
```
npm install --dev
```
Start the development process
```
gulp
```
The development server should be running on port `8080`. Additionally, all the correct files and folders will be watched for changes, recompiling and restarting the server if necessary.
