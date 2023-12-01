import { useState } from "react";

export default function LandingPage() {
  const [phone, setPhone] = useState("");

  return (
    <div>
      Phone number:
      <input
        type="text"
        id="phoneInput"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="submit"
        onClick={() => (window.location.href = `/user/${phone}`)}
      />
    </div>
  );
}
