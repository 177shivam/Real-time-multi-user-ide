# Real-time-multi-user-ide

## Introduction
This project gives the multiple user realtime code editing with compilation and executiion for C++ language.

## Configure
To make the project run change the server IP which is now set as 192.168.29.173 to any local netwok ip or to localhost ip in the project. The changes will be done in following files
1. [server.js](/server.js)
2. [index.html](/index.html)
3. [clientSoc.js](/clientSoc.js)


## Setup
To setup the project user need to have node.js installed in the system. After installing the node.js run the following below commnads.
```
cd path_to_project_directory/
npm init
```
Now run the project using command
```
npm start
```
The project will run successfully on port 81 and you can access the webpage using the ip which you configured above.
Ex- http://192.168.29.173:8100/


## Deploy
This project is deployed on heroku with name [oneide](https://oneide.herokuapp.com/). On visiting oneide heroku url you will be redirected to other url like https://oneide.herokuapp.com/edit/erfgth , this url can be used or shared with other user so that the user having this url can edit the code in realtime.
