# NotesApp
Projektarbeit 1 von Team 9 für HSR CAS Front End Engineering 2016

## Credits

### Scaffolding
Initial setup of this web app generated with [Yeoman Web App Generator](https://github.com/yeoman/generator-webapp#readme)

### Favicon und App-Icon
[Office and Business Icon Pack](https://www.smashingmagazine.com/2015/10/freebie-office-business-icon-pack-ai-eps-psd-pdf-svg/) by Manuela Langella 

### Development

```
npm install
bower install
gulp serve
```

### Git
git commit -a -m "comment"
git pull
git push


# cas-fee-notesserver /server

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
