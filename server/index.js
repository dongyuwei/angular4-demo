
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

class Server {
    constructor(){
        this.app = express();
        this.fs = fs;
        
        this.dataFile  = path.join(__dirname, './comments.json');
    }

    configureApp() {
        this.app.set('port', (process.env.PORT || 3000));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    configureCORS(){
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

            res.setHeader('Cache-Control', 'no-cache');
            next();
        });
    }

    configureRoutes(){
        this.app.get('/api/comments', (req, res) => {
            this.fs.readFile(this.dataFile, (err, data) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                res.json(JSON.parse(data));
            });
        });
        this.app.post('/api/comments', (req, res) => {
            this.fs.readFile(this.dataFile, (err, data) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                var comments = JSON.parse(data);

                var newComment = {
                    id: Date.now(),
                    author: req.body.author,
                    text: req.body.text,
                };

                comments.push(newComment);
                this.fs.writeFile(this.dataFile, JSON.stringify(comments, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(comments);
                });
            });
        });
        this.app.put('/api/comments/:id', (req, res) => {
            this.fs.readFile(this.dataFile, (err, data) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                let comments = JSON.parse(data);
                let idIndex = 0;
                let findCommentById = comments.filter(comment => {
                    if(comment.id == req.params.id) {
                        idIndex = comments.indexOf(comment);
                        return comment;
                    }
                });
                findCommentById[0].text = req.body.text;
                findCommentById[0].author = req.body.author;

                comments.splice(idIndex, 1, findCommentById[0]);
                 this.fs.writeFile(this.dataFile, JSON.stringify(comments, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(comments);
                });
            });
        });
        this.app.delete('/api/comments/:id', (req, res) => {
            this.fs.readFile(this.dataFile, (err, data) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                let comments = JSON.parse(data);
                let idIndex = null;
                let findCommentById = comments.filter(comment => {
                    if(comment.id == req.params.id) {
                        idIndex = comments.indexOf(comment);
                        return comment;
                    }
                });

                if(idIndex >= 0){
                    comments.splice(idIndex, 1);
                }

                 this.fs.writeFile(this.dataFile, JSON.stringify(comments, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(comments);
                });
            });
        });
    }

    listen(port){
        this.app.listen(port, () => {
            console.log(`Server started: http://localhost:${port}/`);
        });
    }

    run(){
        this.configureApp();
        this.configureCORS()
        this.configureRoutes();
        this.listen(this.app.get('port'));
    }
}

var server = new Server();
server.run();