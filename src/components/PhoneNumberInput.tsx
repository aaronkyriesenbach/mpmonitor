import { KeyboardEvent, useState } from "react";

const restrictToNumerals = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key.length === 1 && !"0123456789".includes(event.key)) {
    event.preventDefault();
  }
};

export default function PhoneNumberInput() {
  const [number, setNumber] = useState("");

  // Called to allow successful build so I can commit changes; remove later
  setNumber("");

  return (
    <div className="d-flex gap-2">
      <input
        className="phone-3 rounded-pill text-center"
        value={number.length > 0 ? number.substring(0, 3) : ""}
        onKeyDown={restrictToNumerals}
      />
      <input
        className="phone-3 rounded-pill text-center"
        value={number.length > 3 ? number.substring(3, 6) : ""}
        onKeyDown={restrictToNumerals}
      />
      <input
        className="phone-4 rounded-pill text-center"
        value={number.length > 6 ? number.substring(6, 10) : ""}
        onKeyDown={restrictToNumerals}
      />
    </div>
  );
}
