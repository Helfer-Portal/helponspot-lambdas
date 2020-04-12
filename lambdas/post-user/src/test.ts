import {Database} from "./Database";
import {User} from "../../../common/help-on-spot-models/src";

(async function () {

  const db = new Database();
  const connection = await db.connect();

  let user = new User();
  user.firstName = "Geodude";
  user.lastName = "Pokemon";
  user.isGPSLocationAllowed = true;
  user.avatar = "picture.jpg";

  return connection.manager
    .save(user)
    .then(user => {
      console.log("User has been saved. User id is", user.id);
    });
})();
