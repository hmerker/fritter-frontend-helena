import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {User} from './model';

// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  username: string;
  dateJoined: string;
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
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructUserResponse = (user: HydratedDocument<User>): UserResponse => {
  const userCopy: User = {
    ...user.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete userCopy.password;
  return {
    ...userCopy,
    _id: userCopy._id.toString(),
    dateJoined: formatDate(user.dateJoined)
  };
};

export {
  constructUserResponse
};
