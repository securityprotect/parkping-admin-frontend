export default function CardItem({ card, onEdit, onToggleStatus }) {
  return (
    <tr>
      <td><b>{card.cardNumber}</b></td>

      <td>
        <div className="owner">
          <img
            src={`https://ui-avatars.com/api/?name=${card.ownerName}&background=random`}
            alt="avatar"
          />
          <div>
            <div className="owner-name">{card.ownerName}</div>
            <div className="owner-phone">{card.mobile}</div>
          </div>
        </div>
      </td>

      <td>
        <div className="vehicle">{card.vehicleNumber}</div>
      </td>

      <td>
        <div className="plan">{card.planType}</div>
        <div className="plan-price">
          ₹{card.planType === "Premium Plan" ? "599" : "299"}
        </div>
      </td>

      <td>
        <span className={`status ${card.status}`}>
          {card.status}
        </span>
      </td>

      <td>{card.activationDate}</td>
      <td>{card.expiryDate}</td>
       <td>
        <div className="actions">
          <button
            className="icon-button"
            type="button"
            onClick={() => onEdit(card)}
            title="Edit card details"
          >
            ✏️
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => onToggleStatus(card)}
            title={card.status === "active" ? "Disable card" : "Activate card"}
          >
            {card.status === "active" ? "🚫" : "✅"}
          </button>
        </div>
      </td>
    </tr>
  );
}
