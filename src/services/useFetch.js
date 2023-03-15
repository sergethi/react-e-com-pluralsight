import { useEffect, useState } from "react";
const baseUrl = process.env.REACT_APP_API_BASE_URL;
// custom hook for fetching data
export default function useFetch(url) {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  useEffect(() => {
    async function init() {
      try {
        const response = await fetch(baseUrl + url);
        if (response.ok) {
            const json =  await response.json();
            setData(json);
        }else{
            throw response;
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsloading(false);
      }
    }
    init()
  }, [url]);
  return {data, error, isLoading}
}