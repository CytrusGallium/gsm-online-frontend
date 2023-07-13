import { GetBackEndUrl } from "../../const";
import axios from "axios";

const PerformGetRequest = async (ParamRoute, ParamCallBack) => {
  // Parameters
  // ParamRoute Example : "/api/get-catering-orders-list"

  // Build Request
  var url = GetBackEndUrl() + ParamRoute;

  // Log Request
  console.log("GET : " + url);

  // Perform Request
  try {
    const res = await axios.get(url);
    if (res && ParamCallBack) {
      ParamCallBack(res);
    }
  } catch (error) {
    console.log("GET ERROR : " + error);
  }
}

export { PerformGetRequest };