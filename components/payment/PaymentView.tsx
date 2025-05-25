import React from "react";

interface PaymentViewProps {
  name: string;
  price: string;
  desc: string;
  type: string;
}

export default function PaymentView({ name, price, desc, type }: PaymentViewProps) {
  return (
    <div>
      <h2>Payment: {name}</h2>
      <p>Price: {price}</p>
      <p>Description: {desc}</p>
      <p>Type: {type}</p>
    </div>
  );
} 