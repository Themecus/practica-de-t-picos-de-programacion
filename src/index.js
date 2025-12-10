import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './user.js'



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

app.post('/', async (req, res) => {
    try {
       
        var data = req.body;
        var newUser = new User(data);
        
        await newUser.save();
        res.status(200).send({
            success: true,
            message: "Se registró el usuario",
            outcome: []
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            message: `Error al intentar crear el usuario: ${err.message}`,
            outcome: [],
            errorDetails: err.errors ? err.errors : err.message
        });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        var usuarios = await User.find().exec();
        
        res.status(200).send({
            success: true,
            message: "Se encontraron los usuarios exitosamente",
            outcome: [usuarios]  
        });
    } catch (err) {
        console.error('Error al obtener usuarios:', err.message);
        
        res.status(400).send({
            success: false,
            message: "Error al intentar obtener los usuarios, por favor intente nuevamente",
            outcome: []
        });
    }
});


app.patch('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;  // ID para localizar
        const updateData = req.body;  // datos que se cambiaran o actualizaran
        
        // Validar que existe usuario
        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({
                success: false,
                message: "No hay datos para actualizar"
            });
        }
        
        // Buscar y cambiar datos
        const usuarioActualizado = await User.findByIdAndUpdate(
            id,  
            updateData,  
            { new: true, runValidators: true }  
        );
        
        // Si no existe
        if (!usuarioActualizado) {
            return res.status(404).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        
        res.status(200).send({
            success: true,
            message: "Usuario actualizado exitosamente",
            data: usuarioActualizado
        });
        
    } catch (err) {
        console.error('Error al actualizar usuario:', err.message);
        
        res.status(400).send({
            success: false,
            message: "Error al actualizar el usuario",
            error: err.message
        });
    }
});