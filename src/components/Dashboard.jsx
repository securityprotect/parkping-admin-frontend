import { useEffect, useState } from "react";
import CardItem from "./CardItem";

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("HARD TEST: fetching directly from backend");

    fetch("https://parkping-admin-backend.vercel.app/api/cards")
      .then((res) => {
        if (!res.ok) {
          throw new Error("API response not OK");
        }
        return res.json();
      })
      .then((data) => {
        console.log("DIRECT FETCH DATA 👉", data);
        setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("DIRECT FETCH ERROR 👉", err);
        setError("Failed to load cards");
        setLoading(false);
      });
  }, []);

  const totalCards = cards.length;
  const activeCards = cards.filter(c => c.status === "active").length;

  return (
    <div style={{ padding: 30 }}>
      <h1>Card Management Console</h1>
      <p>Complete operational control center</p>

      {/* STATUS */}
      {loading && <p>Loading cards...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* STATS */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <Stat title="Total Cards" value={totalCards} />
        <Stat title="Active Cards" value={activeCards} />
        <Stat title="Near Expiry" value={0} />
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
        minWidth: 160,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}
