import type {NextFunction, Request, Response} from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import LikeCollection from "./collection";
import * as likeValidator from "./middleware";

const router = express.Router();

/**
 * Check if user has liked content
 *
 * @name GET /api/likes?parentContentId=id
 */
router.get(
  "/:parentContentId?",
  [
    userValidator.isUserLoggedIn, likeValidator.isParamsGiven("query"), likeValidator.isParamsIdValid("query")
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const doesExist = await LikeCollection.findByUserId(userId, req.query.parentContentId as string);
    res.status(200).json({doesExist});
  }
);

/**
 * Create/delete a like
 *
 * @name POST /api/likes
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn, likeValidator.isParamsGiven("body"), likeValidator.isParamsIdValid("body"),
    likeValidator.isParentContentTypeValid(), likeValidator.doesParentContentExist("body"),
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {parentContentId, parentContentType} = req.body;

    const doesLikeExist = await LikeCollection.findByUserId(userId, parentContentId as string);

    let numToChange = 0;
    if (doesLikeExist){
      numToChange = -1;
    }
    else{
      numToChange = 1;
    }

    let likeResult = null;
    if (doesLikeExist){
      likeResult = await LikeCollection.deleteOne(userId, parentContentId as string);
    }
    else{
      likeResult = await LikeCollection.addOne(userId, parentContentId, parentContentType);
    }

    if (likeResult) {
      return res.status(201).json({message: "You liked the content successfully.", countChange: numToChange});
    }
    res.status(404).json({
      message: "You cannot like this content.",
    });
  }
);

export {router as likeRouter};
