# NotesApp
HSR CAS Front End Engineering 2016  
Project assignment 1  
Team 9, Isa Steiner, Patrick Bonetti  


![screenshot of the app](screenshot.png "screenshot of the app")


## Installation
Just check out the git repo and run `npm install` in the root directory of the app.


## Credits
This app is written in Javascript (client and server) and uses [Node.js](https://nodejs.org/) with
[Express](http://expressjs.com) on the server-side. 

Other used components in alphabetical order:
- [Bower](https://bower.io)
- [Font Awesome](http://fontawesome.io)
- [Gulp](http://gulpjs.com) 
- [Handlebars](http://handlebarsjs.com)
- [jQuery](https://jquery.com)
- [Normalize.css](https://necolas.github.io/normalize.css/)

The initial setup of this app is based on a boilerplate generated with [Yeoman Web App Generator](https://github.com/yeoman/generator-webapp#readme)

#Server part (start and run separately atm)

the backend of our CAS application

## install express

npm install express


--> running and listening on port 3000 (http://localhost:3000/#)

##install nedb

npm install nedb

##install our app

npm install

##run
node server.js

##test it

opt: install POSTMAN chrome plugin

fill database with data in storage/backupDB

GET all notes request in POSTMAN to http://localhost:3001/notes

example response: [{"_id":"1","title":"my new appointment","description":"my description","1466269206858","3","1466208000000","true","1466270848490"},{"_id":"2","title":"my new appointment","description":"bla","1466323180692","3","1466294400000","true","1466323187681"},{"_id":"3","title":"my new appointment","description":"here","1466354140554","4","1466294400000","true","1466354149759"},{"_id":"4","title":"item 2","description":"it2","1466354208081","2","1466380800000","false","0"}]

GET one note request in POSTMAN to http://localhost:3001/note/id (pick an id that is actually in the DB (storage/notes.db)

example response: [{"_id":"1","title":"my new appointment","description":"my description","1466269206858","3","1466208000000","true","1466270848490"},{"_id":"2","title":"my new appointment","description":"bla","1466323180692","3","1466294400000","true","1466323187681"},{"_id":"3","title":"my new appointment","description":"here","1466354140554","4","1466294400000","true","1466354149759"},{"_id":"4","title":"item 2","description":"it2","1466354208081","2","1466380800000","false","0"}]

POST request in POSTMAN to http://localhost:3001/note/myTitle/myDescription/2/321/true

params = /<title>/<description>/<priority>/<duedate>/<isdone>/

example response: [{"_id":"b7EDRTzFR6VggAc2"}]

POST request to update a note:

http://localhost:3001/note/update/YuVD5hiZPQ1VVlx9/myNewTitle2/myNewDescription2/2/321/true

example response: [{"_id": "z1mMKtBQuj6YEx6c","status": "OK"}]

--> set tasks on done via the update fuction

##todo

validate fields
enable crap queries
add the GET for a certain note
update an existing note
