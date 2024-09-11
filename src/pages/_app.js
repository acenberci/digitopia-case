import "@/styles/globals.css";
import { HelperContext } from "@/helpers/HelperContext";
import { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';
import Cookies from "js-cookie";
import { appWithTranslation } from 'next-i18next';
import axios from "axios";

function App({ Component, pageProps }) {
  const [popups, setPopups] = useState([]);
  const [rightBar, setRightBar] = useState({ isOpen: false, content: "", title: "" });
  const [userDetails, setUserDetails] = useState({});
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [tasks, setTasks] = useState()
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState({})


  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const idToken = Cookies.get("idToken");

    if (accessToken && idToken) {
      try {
        const decodedAccessToken = jwt.decode(accessToken, { complete: true });
        const decodedIdToken = jwt.decode(idToken, { complete: true });

        if (decodedAccessToken?.payload && decodedIdToken?.payload) {
          setUserDetails({
            ...decodedAccessToken.payload,
            name: decodedIdToken.payload.name,
            email: decodedIdToken.payload.email,
            family_name: decodedIdToken.payload.family_name,
            organizationId: decodedIdToken.payload["custom:organizationId"],
            organizationRole: decodedIdToken.payload["custom:organizationRole"],
            role: decodedIdToken.payload["custom:role"]
          });
          axios.get(`http://ec2-3-123-161-240.eu-central1.compute.amazonaws.com:8181/organization/${decodedIdToken.payload["custom:organizationId"]}/detail http://ec2-3-123-161-240.eu-central-1.compute.amazonaws.com:8181/organization/%3CORGANIZATION_ID%3E/detail`).then((response) => {
            setCountries(response.data)
          }).catch((err) => { console.log(err) })
        }
      } catch (error) {
        console.error("Error decoding tokens:", error);
      }
    }
  }, []);
  useEffect(() => {
    axios.get("http://ec2-3-123-161-240.eu-central-1.compute.amazonaws.com:8080/countries").then((response) => {
      setCountries(response.data)
    }).catch((err) => { console.log(err) })
    axios.get("http://ec2-3-123-161-240.eu-central-1.compute.amazonaws.com:8080/industries").then((response) => {
      setIndustries(response.data)
    }).catch((err) => { console.log(err) })
  }, [])

  return (
    <HelperContext.Provider value={{ rightBar, setRightBar, popups, setPopups, userDetails, panelCollapsed, setPanelCollapsed, tasks, setTasks, dateRange, setDateRange }}>
      <Component {...pageProps} />
    </HelperContext.Provider>
  );
}

export default appWithTranslation(App);
