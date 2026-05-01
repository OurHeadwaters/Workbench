import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import libraryRouter from "./library";
import checkinRouter from "./checkin";
import bookkeeperRouter from "./bookkeeper";
import wordpileRouter from "./wordpile";
import shipManifestRouter from "./shipManifest";
import handbookRouter from "./handbook";
import refundInvocationRouter from "./refundInvocation";
import deadheadRouter from "./deadhead";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use("/library", libraryRouter);
router.use("/check-in", checkinRouter);
router.use("/bookkeeper", bookkeeperRouter);
router.use("/wordpile", wordpileRouter);
router.use("/ship-manifest", shipManifestRouter);
router.use("/handbook", handbookRouter);
router.use("/refund-invocation", refundInvocationRouter);
router.use("/", deadheadRouter);

export default router;
