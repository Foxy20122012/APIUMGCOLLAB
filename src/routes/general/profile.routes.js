import { Router } from "express";
import { getProfileUser} from "../../controllers/general/profile/profile.controller.js";

const router = Router();

router.get("/profile", getProfileUser);



export default router;
