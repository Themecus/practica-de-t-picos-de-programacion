import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


const app = express()
dotenv.config()

const connectDB=()=>{
    const {
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_PORT,
        MONGO_DB,
        MONGO_HOSTNAME,
    }=process.env

//agregar metodo patch

    const url= `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

    mongoose.connect(url).then(function(){
        console.log('mongoDB is connected')
    })
    .catch(function(err){
        console.log(err)
    })
}


const port = 3005
app.use(cors({ origin: '*' })) 
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))

app.listen(port, function () {
    connectDB()
    console.log(`Api corriendo en http://localhost:${port}!`)
})

app.get('/', (req, res)=> {
    console.log('mi primer endponit')
    res.status(200).send('hola la api funciona bien Canache!')
})