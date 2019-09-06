//Developer.updateOne({_id: req.body.developerId}, {$addToSet: {projectIds: savedProject._id }},
//function (err, success) {
//   if (err) {
//       res.status(500).send({error: "Could not add project to developer, " + err.message});
//   } else {
//       res.status(200).send("Success");
//   }
//}); 


//    db.stores.update(
//    { },
//    { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } },
//    { multi: true }
//    )

//var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');

//app.get('/server/:info', function(req, res) {
//    res.status(200).send("server info: " + req.params.info);
//});


//<h1>DudePerson <%=  myVar  %></h1>  // equal sign to render to the html

// <% if (true === myTest) { // evaluates code but does not render to html
// <p> Test is true </p>
// <%>}<%>


//route =====================
//app.get('/posts', function (req, res) {
//    var posts = [
//        {
//            title: 'Post1',
//            author: 'Dude1'
//        },
//        {
//            title: 'Post2',
//            author: 'Dude2'
//        },
//        {
//            title: 'Post3',
//            author: 'Dude3'
//        }
//        ];
//    res.render('serverInfo.ejs', {
//        posts: posts
//    });
//});
//
// views =====================
//<h1>The post page</h1>
//<p>
//    <% for (var i =0; i < posts.length; i ++) { %>
//    <li> <%= posts[i].title %> </li>
//    <%   } %>
// or use forEach
//    <% posts.forEach(function(post) { %>
//    <li> <%= post.title %> </li>
//    <%   }); %>
//</p>

//    <script src="/js/user-data.js"></script>
//    <script src="/.env"></script>
//    <script src="/public/js/dom-items.js"></script>
//    <script src="/public/js/dom-conduction.js"></script>
//    <script src="/public/js/dom-convection.js"></script>
//    <script src="/public/js/dom-heatup.js"></script>
//    <script src="/public/js/dom-processload.js"></script>
//    <script src="/public/js/dom-radiation.js"></script>  

//const request = require('request');
//request('http://www.google.com', function (error, response, body) {
//  console.error('error:', error); // Print the error if one occurred
//  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//  console.log('body:', body); // Print the HTML for the Google homepage.
//});

//var request = require('request');
//var options = {
//    url: 'https://api.weather.gov/points/39.7456,-97.0892',
//    headers: {'User-Agent': 'WeatherMany web app by jimmysoftllc.com email:jbailey@jimmysoftllc.com'},
//    auth: {
//        username: 'JimBailey',
//        password: 'MyPassword'
//    }
//};
//
//request(options, function (error, response, body) {
//    //eval(require('locus'));
//    if(!error && response.statusCode == 200){
//        const parsedData = JSON.parse(body);
//        //console.log(parsedData);
//        //console.log(parsedData["properties"]["forecastOffice"])
//        console.log(parsedData.properties.forecastOffice)
//    } 
//});

