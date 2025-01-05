import axios from "axios";
import { useEffect, useState } from "react";

export default function RelatedPost() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/related-post`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      }
    };

    fetchData();
  }, []);

  console.log(data); // This will log the response data once it's fetched

  return <div>asd</div>;
}
