export default function CardItem({ card }) {
  return (
    <tr>
      <td>{card.cardNumber}</td>
      <td>
        <b>{card.ownerName}</b>
        <br />
        <small>{card.mobile}</small>
      </td>
      <td>{card.vehicleNumber}</td>
      <td>{card.planType}</td>
      <td style={{ color: "green" }}>{card.status}</td>
      <td>{card.activationDate}</td>
      <td>{card.expiryDate}</td>
    </tr>
  );
}
