'use strict' 

const mongoose = require("mongoose");
const app = require("./app");
var admin = require("../src/controllers/userController");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/DBPromesometro', {useNewUrlParser: true}).then(()=>{
    console.log("La base de datos esta corriendo correctamente");

    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'),()=>{ 
        admin.createAdmin();
        console.log(`El servidor esta corriendo en el puerto: '${app.get('port')}'`);
    });
}).catch(err => console.log(err));