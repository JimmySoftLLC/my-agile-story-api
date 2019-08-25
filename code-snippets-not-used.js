//Developer.updateOne({_id: req.body.developerId}, {$addToSet: {projectIds: savedProject._id }},
//function (err, success) {
//   if (err) {
//       res.status(500).send({error: "Could not add project to developer, " + err.message});
//   } else {
//       res.status(200).send("Success");
//   }
//}); 


//                db.stores.update(
//    { },
//    { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } },
//    { multi: true }
//)

//var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');