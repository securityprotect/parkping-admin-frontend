import { useEffect, useMemo, useState } from "react";
import CardItem from "./CardItem";
import StatsCard from "./StatsCard";

const API_URL = "https://parkping-admin-backend.vercel.app/api/cards";

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formState, setFormState] = useState({
    cardNumber: "",
    ownerName: "",
    mobile: "",
    vehicleNumber: "",
    planType: "Standard Plan",
    status: "",
    activationDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error(err));
  }, []);

  const hydrateFormState = card => {
    const normalizeDate = value =>
      value ? value.split("T")[0] : "";

    setFormState({
      cardNumber: card.cardNumber || "",
      ownerName: card.ownerName || "",
      mobile: card.mobile || "",
      vehicleNumber: card.vehicleNumber || "",
      planType: card.planType || "Standard Plan",
      status: card.status || "inactive",
      activationDate: normalizeDate(card.activationDate),
      expiryDate: normalizeDate(card.expiryDate),
    });
  };

  const handleEdit = card => {
    setEditingCard(card);
    hydrateFormState(card);
  };

  const handleCreateStart = () => {
    setEditingCard(null);
    setIsCreating(true);
    setFormState({
      cardNumber: "",
      ownerName: "",
      mobile: "",
      vehicleNumber: "",
      planType: "Standard Plan",
      status: "active",
      activationDate: "",
      expiryDate: "",
    });
  };

  const handleToggleStatus = async card => {
    const nextStatus = card.status === "active" ? "inactive" : "active";
    await handleUpdate(card._id, { status: nextStatus });
  };

  const handleUpdate = async (cardId, updates) => {
    try {
      const response = await fetch(`${API_URL}/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error("Failed to update card");
      }
      const updatedCard = await response.json();
      setCards(prev =>
        prev.map(card => (card._id === cardId ? updatedCard : card))
      );
      if (editingCard && editingCard._id === cardId) {
        setEditingCard(updatedCard);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async payload => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create card");
      }
      const createdCard = await response.json();
      setCards(prev => [createdCard, ...prev]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormChange = event => {
    const { name, value } = event.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    if (isCreating) {
      await handleCreate({
        cardNumber: formState.cardNumber,
        ownerName: formState.ownerName,
        mobile: formState.mobile,
        vehicleNumber: formState.vehicleNumber,
        planType: formState.planType,
        status: formState.status,
        activationDate: formState.activationDate,
        expiryDate: formState.expiryDate,
      });
      setIsCreating(false);
      return;
    }
    if (!editingCard) return;
    await handleUpdate(editingCard._id, {
      cardNumber: formState.cardNumber,
      ownerName: formState.ownerName,
      mobile: formState.mobile,
      vehicleNumber: formState.vehicleNumber,
      planType: formState.planType,
      status: formState.status,
      activationDate: formState.activationDate,
      expiryDate: formState.expiryDate,
    });
    setEditingCard(null);
  };

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
          <div className="table-header-actions">
            <div className="table-badge">Total Cards: {metrics.totalCards}</div>
            <button className="button primary" type="button" onClick={handleCreateStart}>
              + Create Card
            </button>
          </div>
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
              <CardItem
                key={card._id}
                card={card}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </tbody>
        </table>
      </div>

      {editingCard || isCreating ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">
                  {isCreating ? "Create Card" : "Edit Card"}
                </div>
                <div className="modal-subtitle">
                  {isCreating
                    ? "Add a new card into the system."
                    : `Update details for ${editingCard.cardNumber}.`}
                </div>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => {
                  setEditingCard(null);
                  setIsCreating(false);
                }}
                title="Close"
              >
                ✖️
              </button>
            </div>
            <form className="modal-body" onSubmit={handleFormSubmit}>
              <label className="form-field">
                Card Number
                <input
                  name="cardNumber"
                  value={formState.cardNumber}
                  onChange={handleFormChange}
                />
              </label>
              <label className="form-field">
                Owner Name
                <input
                  name="ownerName"
                  value={formState.ownerName}
                  onChange={handleFormChange}
                />
              </label>
              <label className="form-field">
                Mobile Number
                <input
                  name="mobile"
                  value={formState.mobile}
                  onChange={handleFormChange}
                />
              </label>
              <label className="form-field">
                Vehicle Number
                <input
                  name="vehicleNumber"
                  value={formState.vehicleNumber}
                  onChange={handleFormChange}
                />
              </label>
              <label className="form-field">
                Plan Type
                <select
                  name="planType"
                  value={formState.planType}
                  onChange={handleFormChange}
                >
                  <option value="Standard Plan">Standard Plan</option>
                  <option value="Premium Plan">Premium Plan</option>
                </select>
              </label>
              <label className="form-field">
                Status
                <select
                  name="status"
                  value={formState.status}
                  onChange={handleFormChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                </select>
              </label>
              <label className="form-field">
                Activation Date
                <input
                  type="date"
                  name="activationDate"
                  value={formState.activationDate}
                  onChange={handleFormChange}
                />
              </label>
              <label className="form-field">
                Expiry Date
                <input
                  type="date"
                  name="expiryDate"
                  value={formState.expiryDate}
                  onChange={handleFormChange}
                />
              </label>
              <div className="modal-actions">
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => {
                    setEditingCard(null);
                    setIsCreating(false);
                  }}
                >
                  Cancel
                </button>
                <button className="button primary" type="submit">
                  {isCreating ? "Create Card" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
