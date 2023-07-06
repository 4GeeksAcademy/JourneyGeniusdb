import React, { useContext } from "react";
import { Context } from "../store/appContext";

const Trades = () => {
  const { store } = useContext(Context);

  return (
    <div>
      <h2>Trade Proposals</h2>
      {store.tradeProposals.map((proposal) => (
        <div key={proposal.id}>
          <p>
            User "{proposal.sender_name}" has offered "{proposal.sender_item_name}" in exchange for "{proposal.receiver_item_name}"
          </p>
          {proposal.status === "Pending" && (
            <div>
              <button onClick={() => handleAcceptProposal(proposal.id)}>
                Accept
              </button>
              <button onClick={() => handleDeclineProposal(proposal.id)}>
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Trades;
