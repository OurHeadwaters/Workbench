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
import intakeRouter from "./intake";
import wordWalkRouter from "./wordWalk";
import sargeRouter from "./sarge";
import pdfRouter from "./pdf";
import subcontractRouter from "./subcontract";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use("/pdf", pdfRouter);
router.use("/library", libraryRouter);
router.use("/check-in", checkinRouter);
router.use("/bookkeeper", bookkeeperRouter);
router.use("/wordpile", wordpileRouter);
router.use("/ship-manifest", shipManifestRouter);
router.use("/handbook", handbookRouter);
router.use("/refund-invocation", refundInvocationRouter);
router.use("/word-walk", wordWalkRouter);
router.use("/sarge", sargeRouter);
router.use("/", intakeRouter);
router.use("/", deadheadRouter);
router.use("/", subcontractRouter);

export default router;
