'use strict';

const uuid = require('uuid');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

const { Client } = require('pg')
const client = new Client({
    ssl: true,
    user: 'vlfwxubgnzeyob',
    database: 'dffrlsg8033i4o',
    password: '5b922f10fa6fe38e430b34056cae96454b4cfa278e0a53bd453f4a90ade834c5',
    host: 'ec2-23-23-80-20.compute-1.amazonaws.com',
    port: 5432
})

client.connect()
// client.end()

// client.query('CREATE TABLE USERS (ID uuid NOT NULL, firstName character varying NOT NULL)');
// client.query('INSERT INTO USERS VALUES(\''+ uuid.v4()  +'\',\'Sumeet Gohil\')');

//create a server object:
// http.createServer(function (req, res) {
    
//     client.query('SELECT * FROM USERS').then(function (dbres){
//         console.log(dbres);
//         res.write(dbres.rows[0].firstname); //write a response to the client
//         res.end(); //end the response
//     }).catch(function(e) {
//         console.error(e);
//     })
// }).listen(8080); //the server object listens on port 8080

// postgres://vlfwxubgnzeyob:5b922f10fa6fe38e430b34056cae96454b4cfa278e0a53bd453f4a90ade834c5@ec2-23-23-80-20.compute-1.amazonaws.com:5432/dffrlsg8033i4o

/**
PGUSER=vlfwxubgnzeyob \
  PGHOST=ec2-23-23-80-20.compute-1.amazonaws.com \
  PGPASSWORD=5b922f10fa6fe38e430b34056cae96454b4cfa278e0a53bd453f4a90ade834c5 \
  PGDATABASE=dffrlsg8033i4o \
  PGPORT=5432 \
  node index.js
   */

   /***
    * GET USERS FROM PG
    */
  app.get('/api/user', (req, res) => {
        client.query('SELECT * FROM USERS').then(function (dbres){
            res.send(dbres.rows);
        }).catch(function(e) {
            res.send([]);
        })
   });

   /***
    * Inser User to PG TAble
    */
    app.post('/api/user', async (req, res) => {

        const id = uuid.v4();
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const phone = req.body.phone;
        const email = req.body.email;
        const plan = req.body.plan;
        const description = req.body.description;
        const username = req.body.username;
        const password = req.body.password;

        const query = `INSERT INTO USERS VALUES('${id}','${firstname}','${lastname}','${password}','${username}','${email}','${phone}','${plan}','${description}')`;
        const dbResult = await client.query(query);
        console.log(dbResult);
        if (dbResult.rowCount == 1) {
            client.query(`SELECT * FROM USERS WHERE id='${id}'`).then(function (dbres) {
                if (dbres.rows.length === 1) {
                    return res.send({
                        status: true,
                        data: Object.assign({},
                            dbres.rows[0], {
                                password: null
                            })
                    });
                }
                return res.send({
                    status: false
                });
            }).catch(function (e) {
                return res.send({
                    status: false
                });
            })
        }
        else {
            res.send({
                status: false
            });
        }
    });
    app.get('/api/fundraisers', (req, res) => {
        client.query('SELECT * FROM FUNDRAISERS').then(function (dbres){
            res.send(dbres.rows);
        }).catch(function(e) {
            res.send([]);
        })
   });
    app.post('/api/fundraisers', async (req, res) => {
        const username = req.body.username;
        const title = req.body.title;
        const amount = req.body.amount;
        const description = req.body.description;

        const query = `INSERT INTO FUNDRAISERS VALUES('${username}','${title}','${amount}','${description}')`;
        const dbResult = await client.query(query);
        console.log(dbResult);
        if (dbResult.rowCount == 1) {
            client.query(`SELECT * FROM FUNDRAISERS WHERE username='${username}'`).then(function (dbres) {
                if (dbres.rows.length === 1) {
                    return res.send({
                        status: true,
                        data: Object.assign({},
                            dbres.rows[0], {
                                password: null
                            })
                    });
                }
                return res.send({
                    status: false
                });
            }).catch(function (e) {
                return res.send({
                    status: false
                });
            })
        }
        else {
            res.send({
                status: false
            });
        }
    });

   /***
    * GET USERS FROM PG
    */
   app.post('/api/auth', (req, res) => {
       const username = req.body.username;
       const password = req.body.password;

        client.query('SELECT * FROM USERS WHERE username=\''+ username +'\' AND password=\''+ password +'\'').then(function (dbres){
            if(dbres.rows.length === 1) {
                return res.send({
                    status: true,
                    data: Object.assign({},
                        dbres.rows[0],{
                        password: null
                    })
                });
            }
            res.send({
                status: false
            });
        }).catch(function(e) {
            res.send({
                status: false
            });
        })
    });


   app.get('/', (req, res) => {
    res.send({
        name: 'Yash Turkar'
    });
   });

app.listen(8080);