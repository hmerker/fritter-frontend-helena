import type {HydratedDocument} from "mongoose";
import type {Comment, PopulatedComment} from "./model";
import moment from "moment";

type CommentResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  likes: number;
  reports: number;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => {
  const splitBySpaces = date.toString().split(" ");
  const year = splitBySpaces[3].substring(2);
  const month = splitBySpaces[2];
  const day = splitBySpaces[1];
  let hour = date.getHours();
  const minutes = date.getMinutes();
  let strTimeOfDay = "";
  
  if (hour < 12){
    strTimeOfDay = "AM";
  }
  else{
    strTimeOfDay = "PM";
  }
  hour = hour % 12;
  
  return (day + " " + month + ", 20" + year + " at " + hour + ":" + minutes + " " + strTimeOfDay);
};

/**
 * Transform a raw comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
const constructCommentResponse = (
  comment: HydratedDocument<Comment>
): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false,
    }),
  };
  const {username} = commentCopy.authorId;
  return {
    ...commentCopy,
    _id: commentCopy._id.toString(),
    author: username,
    dateCreated: formatDate(commentCopy.dateCreated),
  };
};

export {constructCommentResponse};
