import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    API.get("/cards/stats/dashboard").then(res => setStats(res.data));
  }, []);

  return (
    <div>
      <h2>Total Cards: {stats.total}</h2>
      <h2>Active Cards: {stats.active}</h2>
      <h2>Near Expiry: {stats.nearExpiry}</h2>
    </div>
  );
}
