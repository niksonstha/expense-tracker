import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { TransferForm } from "../features/transfers/TransferForm";

export function TransfersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  function handleAddTransfer() {
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    setIsFormOpen(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transfers</h1>
          <p>Move money between your accounts.</p>
        </div>

        {!isFormOpen && (
          <Button type="button" onClick={handleAddTransfer}>
            Add Transfer
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card>
          <TransferForm
            onSaved={async () => {
              setIsFormOpen(false);
            }}
            onCancel={handleCancelForm}
          />
        </Card>
      )}

      {!isFormOpen && (
        <Card>
          <div className="card-header">
            <div>
              <h2>Account Transfers</h2>
              <p>Move money from one of your accounts to another.</p>
            </div>
          </div>

          <p className="dashboard-empty">
            Click "Add Transfer" to move money between your accounts.
          </p>
        </Card>
      )}
    </div>
  );
}
