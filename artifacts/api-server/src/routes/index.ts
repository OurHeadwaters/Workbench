import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import libraryRouter from "./library";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use("/library", libraryRouter);

export default router;
