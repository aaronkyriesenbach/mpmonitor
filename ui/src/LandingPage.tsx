import { useEffect, useState } from "react";

const phoneRegex = new RegExp(/^\+1\d{10}$/);

export default function LandingPage() {
  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);

  useEffect(() => setValidPhone(phoneRegex.test(phone)), [phone]);

  return (
    <div>
      Phone number (format +1xxxxxxxxxx):
      <input
        type="text"
        id="phoneInput"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="submit"
        disabled={!validPhone}
        onClick={() => (window.location.href = `/user/${phone}`)}
      />
    </div>
  );
}
