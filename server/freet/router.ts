import type {NextFunction, Request, Response} from "express";
import express from "express";
import {Types} from "mongoose";
import FreetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as util from "./util";
import CommentCollection from "../comment/collection";
import LikeCollection from "../like/collection";
import ReportCollection from "../report/collection";

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetResponse[]} - An array of freets created by user with username, author
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author || req.query.freetId) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.author) {
      next();
      return;
    }
    let freetId = req.query.freetId as string;
    if (!freetId || freetId === null){
      freetId = '';
    }
    if (!Types.ObjectId.isValid(freetId)) {
      return res.status(400).json({message: "FreetId is invalid."});
    }
    const freetFound = await FreetCollection.findById(req.query.freetId as string);
    if (!freetFound) {
      return res.status(404).json({message: "Cannot find the freet."});
    }
    return res.status(200).json(util.constructFreetResponse(freetFound));
  },
  [userValidator.isAuthorExists],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(
      req.query.author as string
    );
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
  * Get freets of users followed to populate user's feed
  *
  * @name GET /api/freets/feed?authorId=id
  */
router.get(
  "/feed",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? "";
    const freetList = await FreetCollection.getFreetsForFeed(userId, req.query.authorId ? (req.query.authorId as string) : null);
    const response = freetList.map(util.constructFreetResponse);
    return res.status(200).json(response);
  }
);

/**
 * Get freets for explore page
 *
 * @name GET /api/freets/explore?authorId=id
 */
 router.get(
  "/explore",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? "";
    const freetList = await FreetCollection.getFreetsForExplore(userId, req.query.authorId ? (req.query.authorId as string) : null);
    const response = freetList .map(util.constructFreetResponse);
    return res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, freetValidator.isValidFreetContent],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const sourceRaw = req.body.source as string;
    let source = "none";
    if (sourceRaw !== null && sourceRaw !== ""){
      source = sourceRaw;
    }
    const freet = await FreetCollection.addOne(userId, req.body.content, source);

    res.status(201).json({
      message: "Your freet was created successfully.",
      freet: util.constructFreetResponse(freet),
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    const {freetId} = req.params;
    await CommentCollection.deleteMany({parentContentId: freetId});
    await LikeCollection.deleteMany({parentContentId: freetId});
    await ReportCollection.deleteMany({parentContentId: freetId});
    res.status(200).json({
      message: "Your freet was deleted successfully.",
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent,
    freetValidator.isValidFreetEdit,
  ],
  async (req: Request, res: Response) => {
    const sourceRaw = req.body.source;
    let source = "none";
    if (sourceRaw !== null && sourceRaw !== ""){
      source = sourceRaw;
    }
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content, source);
    res.status(200).json({
      message: "Your freet was updated successfully.",
      freet: util.constructFreetResponse(freet),
    });
  }
);

export {router as freetRouter};
