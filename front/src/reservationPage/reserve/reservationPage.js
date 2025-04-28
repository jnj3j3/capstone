import React from "react";
import Seat from "./component/seat";
import { useLocation } from "react-router-dom";
function ReservationPage() {
  const location = useLocation();
  const { ticketId } = location.state || {};
  return <Seat ticketId={ticketId} />;
}

export default ReservationPage;
