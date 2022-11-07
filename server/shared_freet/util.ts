import type {HydratedDocument} from "mongoose";
import type {SharedFreet, PopulatedSharedFreet} from "./model";
import moment from 'moment';
import type {User} from "../user/model";

// Update this if you add a property to the Freet type!
type SharedFreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  comments: number;
  likes: number;
  reports: number;
  collaboratingAuthors: Array<User>;
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
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<SharedFreet>} freet - A freet
 * @returns {SharedFreetResponse} - The freet object formatted for the frontend
 */
const constructSharedFreetResponse = (freet: HydratedDocument<SharedFreet>): SharedFreetResponse => {
  const freetCopy: PopulatedSharedFreet = {
    ...freet.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const {username} = freetCopy.authorId;
  delete freetCopy.authorId;
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified),
  };
};

export {constructSharedFreetResponse};

