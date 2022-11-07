import type {HydratedDocument} from "mongoose";
import type {Freet, PopulatedFreet} from "../freet/model";
import moment from 'moment';

// Update this if you add a property to the Freet type!
type FreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  comments: number;
  likes: number;
  reports: number;
  source: string;
  numCharsChanged: number;
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
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = (freet: HydratedDocument<Freet>): FreetResponse => {
  const freetCopy: PopulatedFreet = {
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

export {constructFreetResponse};

