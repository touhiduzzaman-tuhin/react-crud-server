const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParse.json());
app.use(cors());

const port = 5000;

// console.log(process.env.DB_COLLECTION);

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.bjf0d.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const studentCollection = client.db("studentInformation").collection("students");
  // perform actions on the collection object
//   client.close();
  app.post('/addStudents', (req, res) => {
      const students = req.body;
    //   console.log(students);
      studentCollection.insertMany(students)
      .then(result => {
          res.send(result);
          console.log(result);
      })
  })

  app.post('/addSingleStudent', (req, res) => {
      const student = req.body;
      studentCollection.insertOne(student)
      .then(result => {
          res.send(result);
          console.log(result);
      })
  })

  app.get('/students', (req, res) => {
      studentCollection.find({})
      .toArray( (err, documents) => {
        //   console.log(documents);
          res.send(documents);
      })
  })

  app.delete('/students/:id', (req, res) => {
      studentCollection.deleteOne({_id : ObjectId(req.params.id)})
      .then(result => {
          res.send(result.deletedCount > 0)
      })
  })
});

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(port);