import { useEffect, useState } from "react";
import CardItem from "./CardItem";
import StatsCard from "./StatsCard";

const API_URL = "https://parkping-admin-backend.vercel.app/api/cards";

export default function Dashboard() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard">

      <h1 className="title">Card Management Console</h1>
      <p className="subtitle">
        Complete operational control center for card lifecycle management
      </p>

      {/* STATS */}
      <div className="stats">
        <StatsCard title="Total Cards" value={cards.length} />
        <StatsCard
          title="Active Cards"
          value={cards.filter(c => c.status === "active").length}
        />
        <StatsCard
          title="Near Expiry"
          value={cards.filter(c => c.status !== "active").length}
        />
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="cards-table">
          <thead>
            <tr>
              <th>Card ID</th>
              <th>Owner Details</th>
              <th>Vehicle Info</th>
              <th>Plan Type</th>
              <th>Status</th>
              <th>Activation Date</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cards.map(card => (
              <CardItem key={card._id} card={card} />
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
