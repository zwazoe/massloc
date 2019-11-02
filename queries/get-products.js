// get all products
db.getCollection('products').aggregate([
  { "$lookup": 
      {
        "localField": "attributes_category",
        "from": "categories",
        "foreignField": "_id",
        "as": "categories"
      }
  },
  { "$unwind": "$categories" },
  { "$group": {
        "_id": "$_id",
        "categories": { "$push": "$attributes_category" },
        "categories": { "$push": "$categories" }
    }
  }
]);