const express = require('express')
const app = express()
const cors=require('cors')
const BodyParser=require('body-parser')
const port = 1000
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://UTSA-DEV:TiUvIxKkzwHdkZWY@cluster1.82lzw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
;require('dotenv').config()
const ObjectId=require('mongodb').ObjectId
app.use(cors())
app.use(BodyParser.json())
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('UTSABD official server reporting  SIR')
  })

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
    console.log(err)
    const CollectionOfAdmin = client.db(`${process.env.DB_NAME}`).collection('AdminEmails')
    const CollectionOfMembers = client.db(`${process.env.DB_NAME}`).collection('TeamMembers')
    const CollectionOfUserProfiles = client.db(`${process.env.DB_NAME}`).collection('User-Profiles')
    const CollectionOfOnudaanData = client.db(`${process.env.DB_NAME}`).collection('Donation')

    console.log('db connented')
    //adminEmail
    app.post("/addAdmin", (req,res)=>{
    const email=req.body
    res.send(email)
    CollectionOfAdmin.insertOne(req.body)
    .catch(err=>console.log(err))
})
app.get('/getadminemail',(req,res)=>{
  const email=req.query.email
  CollectionOfAdmin.find({email:email})
  .toArray((err,documents)=>{
    res.send(documents)
   console.log(documents)
  })
})
//addingMembers
app.post('/addMember',(req,res)=>{
  console.log(req.body)

const file=req.files.file
const Bagaan=req.body.Bagaan
const FullName=req.body.FullName
const Position=req.body.Position
const University=req.body.University
const Phone=req.body.Phone
  
const actualImage=file.data
const encImage=actualImage.toString('base64')
const Image={
  ContetntType:file.mimetype,
  size:file.size,
  img:Buffer.from(actualImage,'base64')
}
CollectionOfMembers.insertOne({Image,Bagaan,FullName,Position,University,Phone})
.then(result=>{console.log(result) 
res.send(result)})
})

app.get('/getTeamMembers',(req,res)=>{
  CollectionOfMembers.find({})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

//removedmember
app.delete('/RemoveMember/:id',(req,res)=>{
  console.log(req.params.id)
  CollectionOfMembers.deleteOne({_id:ObjectId(req.params.id)})
  .then(result=>{console.log(result.deletedCount);res.send(result)})
  .catch(error=>console.log(error))
})
//updatemember

// app.get('/getTemMember/:id',(req,res)=>{
  // console.log(req.params.id)
// CollectionOfMembers.find({_id:ObjectId(req.params.id)})
// .toArray((err,documents)=>{
//   res.send(documents)
//   console.log(documents)
// }
// )
// })

app.patch('/UpdateMember/:id',(req,res)=>{
  // console.log(req.params.id)
  // console.log(req.body)
  // console.log(req.files)
  if (req.files ==null) {
    CollectionOfMembers.updateOne({_id:ObjectId(req.params.id)},
  {$set:{FullName:req.body.FullName,Phone:req.body.MobNum,Position:req.body.Position,Bagaan:req.body.Bagaan,University:req.body.University}}
  )
  .then(result=>{
    console.log(result.modifiedCount)
  res.send(result)
})
  }
  else{

    const ImageFile=req.files.file
    const Image=ImageFile.data
    const encodedImage=Image.toString('base64')
    const BinaryImage={
      ContetntType:ImageFile.mimetype,
      size:ImageFile.size,
      img:Buffer.from(encodedImage,('base64'))}
      
    CollectionOfMembers.updateOne({_id:ObjectId(req.params.id)},
    {$set:{FullName:req.body.FullName,Phone:req.body.MobNum,Position:req.body.Position,Bagaan:req.body.Bagaan,University:req.body.University,Image:BinaryImage}})
    .then(result=>{
      console.log(result.modifiedCount)
    res.send(result)
  })
  }
  
  
  

}

)


//saveprofile
app.post('/SaveProfileUser',(req,res)=>{
const File=req.files.File
console.log(req)
const FullName=req.body.FullName
const University=req.body.University
const Bagaan=req.body.Bagaan
const Gender=req.body.Gender
const Mobile=req.body.Mobile
const Email=req.body.Email

const onlyImage=File.data
const encImage=onlyImage.toString('base64')
const UserProfilePic={
  ContetntType:File.mimetype,
  size:File.size,
  img:Buffer.from(encImage,'base64')
}


CollectionOfUserProfiles.insertOne({UserProfilePic,FullName,University,Bagaan,Gender,Mobile,Email})
.then(result=>{
  console.log(result)
  res.send(result)
})
})

app.get('/getTheUserProfile',(req,res)=>{
  const Email=req.query.Email
  CollectionOfUserProfiles.find({Email:Email})
  .toArray((err,documents)=>{
    res.send(documents)
    // console.log(documents)
  })
})

//Donation
app.post('/Donation',(req,res)=>{
  const File=req.files.File
console.log(req)
const FullName=req.body.FullName
const University=req.body.University
const Bagaan=req.body.Bagaan
const Mobile=req.body.Mobile
const Email=req.body.Email
const Amount=req.body.Amount
const Bkash=req.body.Bkash
const TrasactionID=req.body.TransactionID
const Pending=req.body.Pending


const onlyImage=File.data
const encImage=onlyImage.toString('base64')
const Donator={
  ContetntType:File.mimetype,
  size:File.size,
  img:Buffer.from(encImage,'base64')
}

CollectionOfOnudaanData.insertOne({Donator,FullName,Mobile,Bkash,Amount,TrasactionID,University,Bagaan,Email,Pending})
.then(result=>{res.send(result);console.log(result)})
}
)
app.get('/GetInfoDonation',(req,res)=>{
  CollectionOfOnudaanData.find({})
  .toArray((err,documents)=>{
    res.send(documents)
    // console.log(documents)
  })
})


})




app.listen(process.env.PORT || port)