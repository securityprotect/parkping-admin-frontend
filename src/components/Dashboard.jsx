import { useEffect, useState } from "react";
import API from "../services/api";
import CardItem from "./CardItem";

export default function Dashboard() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    console.log("VITE_API_URL 👉", import.meta.env.VITE_API_URL);

    API.get("/cards")
      .then((res) => {
        console.log("API RESPONSE 👉", res.data);
        setCards(res.data);
      })
      .catch((err) => {
        console.error("API ERROR 👉", err);
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Card Management Console</h1>
      <p>Complete operational control center</p>

      <div style={{ display: "flex", gap: 20 }}>
        <Stat title="Total Cards" value={cards.length} />
        <Stat
          title="Active Cards"
          value={cards.filter(c => c.status === "active").length}
        />
        <Stat title="Near Expiry" value={0} />
      </div>

      <h2 style={{ marginTop: 40 }}>Cards</h2>

      <table width="100%" border="1">
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
          {cards.map(card => (
            <CardItem key={card._id} card={card} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 10,
      minWidth: 150
    }}>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}
