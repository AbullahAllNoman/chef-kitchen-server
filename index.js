const express = require('express')
const app =express()
const cors =require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.22d6kxh.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const foodcategory =client.db('chefFood').collection('category')
    const service =client.db('chefFood').collection('service')
    const orderCollection =client.db('chefFood').collection('order')
    const commentCollection =client.db('chefFood').collection('comment')
   app.get('/catergory',async(req,res)=>{
        const query={}
        const cursor =foodcategory.find(query)
        const data =await cursor.toArray()
        res.send(data)
   })
    app.get('/foodservice/:id',async(req,res)=>{
        const id = req.params.id
        if(id==="0"){
            const query={}
            const cursor =service.find(query)
            const data = await cursor.toArray()
            res.send(data)
        }
        else{

            const query={ categoryID:id}
            const cursor =service.find(query)
            const data =await cursor.toArray()
            res.send(data)
        }
    })
    app.get('/menu/:id',async(req,res)=>{
      const id =req.params.id
      const query ={ _id: new ObjectId(id)}
      const data = await service.findOne(query)
      res.send(data)
    })
    app.get('/list',async(req,res)=>{
        const query={}
        const cursor =orderCollection.find(query)
        const data =await cursor.toArray()
        res.send(data)
    })
    app.patch('/order/:id',async(req,res)=>{
      const id =req.params.id
      const status =req.body.status
      const query={_id: new ObjectId(id)}
          const updateDocs={
            $set:{
              status:status
            }
          }
      const result = await commentCollection.updateOne(query,updateDocs)
      console.log(result)
      res.send(result)
    })
    app.delete('/order/:id',async(req,res)=>{
      const id =req.params.id
      const query ={_id: new ObjectId(id)}
      const result =await orderCollection.deleteOne(query)
      console.log(result)
      res.send(result)
    })

    app.post('/orders',async(req,res)=>{
      const order =req.body
      const result =await orderCollection.insertOne(order)
      res.send(result)
      
    })
    app.patch('/comments',async(req,res)=>{
      const comment = req.body
      const result = await commentCollection.insertOne(comment)
      res.send(result)
    })
    app.get('/comments',async(req,res)=>{
      const id =req.query.id
      const query={serviceID: id}
      const cursor = commentCollection.find(query)
      const result =await cursor.toArray()
      res.send(result)
    })
    app.get('/mycomments',async(req,res)=>{
      const name =req.query.name
      const query={name: name}
      const cursor = commentCollection.find(query)
      const result =await cursor.toArray()
      res.send(result)
    })
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Chef Food')
})

app.listen(port,()=>{
    console.log(`your server is running on port ${port}`)
})

