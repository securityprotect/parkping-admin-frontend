export default function CardItem({ card, onDelete }) {
  return (
    <div className="card">
      <h3>{card.holderName}</h3>
      <p>{card.cardNumber}</p>
      <p>Status: {card.status}</p>
      <button onClick={() => onDelete(card._id)}>Delete</button>
    </div>
  );
}
