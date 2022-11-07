import type { NextFunction, Request, Response } from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import ReportCollection from "./collection";
import * as reportValidator from "./middleware";

const router = express.Router();

/**
 * Check if user has reported content
 *
 * @name GET /api/reports?parentContentId=id
 *
 */
router.get(
  "/:parentContentId?",
  [
    userValidator.isUserLoggedIn, reportValidator.isParamsGiven("query"), reportValidator.isParamsIdValid("query"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const doesExist = await ReportCollection.findByUserId(userId, req.query.parentContentId as string);
    res.status(200).json({doesExist});
  }
);

/**
 * Create/delete a report
 *
 * @name POST /api/report
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn, reportValidator.isParamsGiven("body"), reportValidator.isParamsIdValid("body"), reportValidator.isValidContent,
    reportValidator.isParentContentTypeValid(), reportValidator.doesParentContentExist("body"),

  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {parentContentId, parentContentType, content} = req.body;

    const doesReportExist = await ReportCollection.findByUserId(userId, parentContentId as string);

    let numToChange = 0;
    if (doesReportExist){
      numToChange = -1;
    }
    else{
      numToChange = 1;
    }

    let reportResult = null;
    if (doesReportExist){
      reportResult = await ReportCollection.deleteOne(userId, parentContentId as string);
    }
    else{
      reportResult = await ReportCollection.addOne(userId, parentContentId, parentContentType, content);
    }

    if (reportResult) {
      return res.status(201).json({message: "You reported the content successfully.", countChange: numToChange});
    }
    res.status(404).json({
      message: "You cannot report this content.",
    });

  }
);

export {router as reportRouter};
