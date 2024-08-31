import { JweController } from '@controllers/jwe.controllers';
import { Router } from 'express'


const routerJwe = Router()

routerJwe.get("/decode/:jwe", JweController.decode);
routerJwe.get("/encode/:jwe", JweController.encode);

export default routerJwe;