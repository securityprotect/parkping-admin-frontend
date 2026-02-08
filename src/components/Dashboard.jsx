import { useEffect, useState } from "react";
import API from "../services/api";
import CardItem from "./CardItem";

export default function Dashboard() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    API.get("/cards")
      .then((res) => {
        setCards(res.data);
      })
      .catch((err) => {
        console.error("API error", err);
      });
  }, []);

  const totalCards = cards.length;
  const activeCards = cards.filter((c) => c.status === "active").length;

  const parseDate = (d) => {
    if (!d) return null;
    const [day, month, year] = d.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const nearExpiry = cards.filter((c) => {
    const expiry = parseDate(c.expiryDate);
    if (!expiry) return false;
    const diff = (expiry - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  }).length;

  return (
    <div style={{ padding: 30 }}>
      <h1>Card Management Console</h1>
      <p>Complete operational control center</p>

      {/* STATS */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <Stat title="Total Cards" value={totalCards} />
        <Stat title="Active Cards" value={activeCards} />
        <Stat title="Near Expiry" value={nearExpiry} />
      </div>

      {/* TABLE */}
      <div style={{ marginTop: 40 }}>
        <h2>Cards</h2>

        <table width="100%" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Card ID</th>
              <th>Owner</th>
              <th>Vehicle</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Activation</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <CardItem key={card._id} card={card} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        minWidth: 180,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}
