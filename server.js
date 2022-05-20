// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

const db = require('./models');
const BooksModel = require('./models/books');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      { method: 'GET', path: '/api', description: 'Describes all available endpoints' },
      { method: 'GET', path: '/api/profile', description: 'Data about me' },
      { method: 'GET', path: '/api/books/', description: 'Get All books information' },
      { method: 'POST', path: '/api/books/', description: 'Create new book' },
      { method: 'PUT', path: '/api/books/:id', description: 'Update existing book information' },
      { method: 'DELETE', path: '/api/books/:id', description: 'Delete an existing book' },
      // TODO: Write other API end-points description here like above
    ]
  })
});
// TODO:  Fill the values
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'John',
    'homeCountry': 'Albania',
    'degreeProgram': 'Informatics',//informatics or CSE.. etc
    'email': 'johnsnow@albania.com',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': '', //leave this also blank for the first exercise
    'currentCity': 'Munich',
    'hobbies': ["Music", "Basketball", "Reading books"]
  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', (req, res) => {

  /*
   * New Book information in req.body
   */
  /*
   * TODO: use the books model and create a new object
   * with the information in req.body
   */
  /*
   * return the new book information object as json
   */


  var newBook = new BooksModel({
    title: req.body.title,
    author: req.body.author,
    releaseDate: req.body.author,
    genre: req.body.genre,
    rating: req.body.rating,
    language: req.body.language
  })

  newBook.save((err) => {
    if (err) res.json(409)
  })

  res.json(newBook);
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', async (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;

  /*
   * TODO: use the books model and find using the bookId and update the book information
   */
  /*
   * Send the updated book information as a JSON ozbject
   */

  // const findBook = await BooksModel.findById(bookId).exec();
  // const updateBook = {...findBook, bookNewData};
  // const newBook = await BooksModel.updateOne(updateBook)
  BooksModel.findByIdAndUpdate(bookId, bookNewData, { new: true }).then((response) => {
    res.json(response);
  })
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', async (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * TODO: use the books model and find using
   * the bookId and delete the book
   */
  /*
   * Send the deleted book information as a JSON object
   */

  try {
    var book = await BooksModel.findById(bookId)
    const { deletedCount }= await BooksModel.deleteOne({ _id: bookId })
    if(deletedCount && deletedCount === 1)
      return res.json(book)
  } catch (err) {
    return res.json(404)
  }

  res.json(500)
});


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
