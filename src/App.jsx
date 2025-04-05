import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [breweries, setBreweries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        const response = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=10");
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Fetched data:", data);
        setBreweries(data);
      } catch (error) {
        console.error("Error fetching breweries:", error);
      }
    };

    fetchData();
  }, []);

  const filteredBreweries = breweries.filter((brewery) => {
    const nameMatch = brewery.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = filterType ? brewery.brewery_type === filterType : true;
    return nameMatch && typeMatch;
  });

  const uniqueTypes = [...new Set(breweries.map((b) => b.brewery_type).filter(Boolean))];

  return (
    <div className="dashboard">
      <h1>Brewery Dashboard</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="stats">
        <p>Total Breweries: {breweries.length}</p>
        <p>Filtered: {filteredBreweries.length}</p>
        <p>Types: {uniqueTypes.length}</p>
      </div>

      <ul className="brewery-list">
        {filteredBreweries.map((brewery) => (
          <li key={brewery.id} className="brewery-item">
            <h3>{brewery.name}</h3>
            <p> {brewery.city}, {brewery.state}</p>
            <p> Type: {brewery.brewery_type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
