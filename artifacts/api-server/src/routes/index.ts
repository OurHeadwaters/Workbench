import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import mediaRouter from "./media";
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
import pgv2Router from "./pgv2";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(mediaRouter);
router.use("/pdf", pdfRouter);
router.use("/library", libraryRouter);
// Renamed from /check-in → /annual-check-in (task #1120) to make the
// route's ownership explicit: it serves only the operating plan's
// year/check-in page, not the retired standalone check-in artifact.
router.use("/annual-check-in", checkinRouter);
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
router.use("/pgv2", pgv2Router);

export default router;
