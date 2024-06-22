import express from "express";
import { createUser ,bookVisit,allBooking, cancelBooking, favorite,allfavorite} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id",bookVisit)
router.post("/allBookings",allBooking)
router.post("/removeBooking/:id",cancelBooking)
router.post("/favorite/:id",favorite)
router.post("/allfavorite/",allfavorite)

export default router;
