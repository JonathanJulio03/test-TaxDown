import { CustomerController } from '@controllers/customer.controllers';
import { bodyPatchSchema, bodySchema } from '@controllers/request/validate';
import validateBody from '@middleware/validate-body';
import { Router } from 'express'


const router = Router()

router.get('/customers/:id', CustomerController.getById);

router.get("/customers", CustomerController.get);

router.post("/customers", validateBody(bodySchema), CustomerController.create);

router.put("/customers/:id", validateBody(bodySchema), CustomerController.update);

router.patch("/customers/:id", validateBody(bodyPatchSchema), CustomerController.patch);

router.delete("/customers/:id", CustomerController.delete);

export default router;