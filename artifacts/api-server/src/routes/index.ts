import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import libraryRouter from "./library";
import checkinRouter from "./checkin";
import bookkeeperRouter from "./bookkeeper";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use("/library", libraryRouter);
router.use("/check-in", checkinRouter);
router.use("/bookkeeper", bookkeeperRouter);

export default router;
