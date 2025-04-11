import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const [breweries, setBreweries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=50");
        const data = await response.json();
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

  // Chart Data: Breweries by Type
  const breweryTypeCounts = breweries.reduce((acc, b) => {
    acc[b.brewery_type] = (acc[b.brewery_type] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(breweryTypeCounts),
    datasets: [
      {
        label: "Breweries by Type",
        data: Object.values(breweryTypeCounts),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Chart Data: Top 10 States by Brewery Count
  const stateCounts = breweries.reduce((acc, b) => {
    acc[b.state] = (acc[b.state] || 0) + 1;
    return acc;
  }, {});

  const topStates = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const pieChartData = {
    labels: topStates.map(([state]) => state),
    datasets: [
      {
        label: "Top 10 States by Brewery Count",
        data: topStates.map(([_, count]) => count),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#00A36C", "#C71585",
          "#FFA07A", "#20B2AA",
        ],
      },
    ],
  };

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
        <p>Unique Types: {uniqueTypes.length}</p>
      </div>

      <div className="charts">
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Bar data={barChartData} />
        </div>
        <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
          <Pie data={pieChartData} />
        </div>
      </div>

      <ul className="brewery-list">
        {filteredBreweries.map((brewery) => (
          <li key={brewery.id} className="brewery-item">
            <Link to={`/brewery/${brewery.id}`} className="brewery-link">
              <h3>{brewery.name}</h3>
              <p>{brewery.city}, {brewery.state}</p>
              <p>Type: {brewery.brewery_type}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
