import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Detail() {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);

  useEffect(() => {
    const fetchBrewery = async () => {
      const res = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
      const data = await res.json();
      setBrewery(data);
    };
    fetchBrewery();
  }, [id]);

  if (!brewery) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h1>{brewery.name}</h1>
      <p><strong>Type:</strong> {brewery.brewery_type}</p>
      <p><strong>City:</strong> {brewery.city}</p>
      <p><strong>State:</strong> {brewery.state}</p>
      <p><strong>Phone:</strong> {brewery.phone}</p>
      <p><strong>Website:</strong> <a href={brewery.website_url} target="_blank" rel="noreferrer">{brewery.website_url}</a></p>
    </div>
  );
}

export default Detail;
