import { useEffect, useMemo, useState } from "react";
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

  const metrics = useMemo(() => {
    const totalCards = cards.length;
    const activeCards = cards.filter(c => c.status === "active").length;
    const inactiveCards = totalCards - activeCards;
    const premiumCards = cards.filter(c => c.planType === "Premium Plan").length;
    const standardCards = totalCards - premiumCards;
    const activeRate = totalCards ? Math.round((activeCards / totalCards) * 100) : 0;
    const premiumRate = totalCards ? Math.round((premiumCards / totalCards) * 100) : 0;
    const activeOwners = new Set(
      cards
        .filter(c => c.status === "active")
        .map(card => card.mobile || card.ownerName)
        .filter(Boolean)
    ).size;
    const totalOwners = new Set(
      cards.map(card => card.mobile || card.ownerName).filter(Boolean)
    ).size;

    return {
      totalCards,
      activeCards,
      inactiveCards,
      premiumCards,
      standardCards,
      activeRate,
      premiumRate,
      activeOwners,
      totalOwners,
    };
  }, [cards]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="title">ParkPing Admin Overview</h1>
          <p className="subtitle">
            Live operational summary of cards, subscriptions, and active users.
          </p>
        </div>
        <div className="header-pill">Data source: ParkPing Core</div>
      </div>

      <div className="stats">
        <StatsCard
          title="Total Cards"
          value={metrics.totalCards}
          description="All issued access cards in circulation."
          icon="🪪"
          accent="primary"
        />
        <StatsCard
          title="Active Subscriptions"
          value={metrics.activeCards}
          description={`${metrics.activeRate}% of cards currently active.`}
          icon="✅"
          accent="success"
        />
        <StatsCard
          title="Active Users"
          value={metrics.activeOwners}
          description={`${metrics.totalOwners} total unique users tracked.`}
          icon="👥"
          accent="info"
        />
        <StatsCard
          title="Expiring / Inactive"
          value={metrics.inactiveCards}
          description="Cards that need attention or renewal."
          icon="⚠️"
          accent="warning"
        />
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-title">Plan Distribution</div>
          <div className="insight-metric">{metrics.premiumRate}% Premium</div>
          <div className="progress">
            <div
              className="progress-bar premium"
              style={{ width: `${metrics.premiumRate}%` }}
            />
          </div>
          <div className="insight-subtext">
            Premium: {metrics.premiumCards} · Standard: {metrics.standardCards}
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-title">Subscription Health</div>
          <div className="insight-metric">{metrics.activeRate}% Active</div>
          <div className="progress">
            <div
              className="progress-bar active"
              style={{ width: `${metrics.activeRate}%` }}
            />
          </div>
          <div className="insight-subtext">
            Active: {metrics.activeCards} · Inactive: {metrics.inactiveCards}
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-title">User Coverage</div>
          <div className="insight-metric">
            {metrics.totalOwners ? Math.round((metrics.activeOwners / metrics.totalOwners) * 100) : 0}%
            Active Users
          </div>
          <div className="progress">
            <div
              className="progress-bar users"
              style={{
                width: `${
                  metrics.totalOwners
                    ? Math.round((metrics.activeOwners / metrics.totalOwners) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="insight-subtext">
            Active: {metrics.activeOwners} · Total: {metrics.totalOwners}
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Card Portfolio</div>
            <div className="table-subtitle">
              Monitor lifecycle, ownership, and plan activity across the network.
            </div>
          </div>
          <div className="table-badge">Total Cards: {metrics.totalCards}</div>
        </div>
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
