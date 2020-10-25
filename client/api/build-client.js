import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      // kubectl get namespace
      // default
      // ingress-nginx
      //kubectl get services -n ingress-nginx
      //ingress-nginx-controller
      //"http://ServiceName.Namespace.svc.cluster.local"
      // we can have shart url mapping like this : http://ingress-nginx-srv
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers, // header.host: ticketing.com & header.cookie= req.header.cookie
    });
    // Below code is expanded of above one
    /*const {data} = await axios.get("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        {
          headers :{
            Host:"ticketing.dev",
            cokkie:req.header.cokkie
          } 
        }
      ); */
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
