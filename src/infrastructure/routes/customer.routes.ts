import { CustomerController } from '@controllers/customer.controllers';
import { decryptMiddleware } from '@middleware/decrypt';
import { encryptMiddleware } from '@middleware/encrypt';
import { Router } from 'express'


const router = Router()

// Use middleware for decryption and encryption
router.use(decryptMiddleware);
router.use(encryptMiddleware);

router.get('/customers/:id', CustomerController.getById);

router.get("/customers", CustomerController.get);

router.post("/customers", CustomerController.create);

router.put("/customers/:id", CustomerController.update);

router.patch("/customers/:id", CustomerController.patch);

router.delete("/customers/:id", CustomerController.delete);

export default router;