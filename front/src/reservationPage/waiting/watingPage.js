import React from "react";
import QueueStatus from "./component/waitingComponent";
import { useParams } from "react-router-dom";
function WaitingPage() {
  const { ticketId } = useParams();
  return <QueueStatus ticketId={ticketId} />;
}

export default WaitingPage;
