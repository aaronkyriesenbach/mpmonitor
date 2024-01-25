import { KeyboardEvent, createRef, useEffect, useState } from "react";

export default function PhoneNumberInput() {
  const [number, setNumber] = useState("");
  const ref0 = createRef<HTMLInputElement>();
  const ref1 = createRef<HTMLInputElement>();
  const ref2 = createRef<HTMLInputElement>();

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      if (number.length === 3 && document.activeElement === ref1.current) {
        ref0.current?.focus();
      } else if (
        number.length === 6 &&
        document.activeElement === ref2.current
      ) {
        ref1.current?.focus();
      }
    }

    if (event.key.length === 1 && !"0123456789".includes(event.key)) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (number.length === 3 && document.activeElement === ref0.current) {
      ref1.current?.focus();
    } else if (number.length === 6 && document.activeElement === ref1.current) {
      ref2.current?.focus();
    }
  }, [number]);

  return (
    <div className="d-flex gap-2">
      <input
        className="phone-3 rounded-pill text-center"
        ref={ref0}
        value={number.length > 0 ? number.substring(0, 3) : ""}
        onKeyDown={handleKeyPress}
        onChange={(e) => setNumber(e.target.value)}
      />
      <input
        className="phone-3 rounded-pill text-center"
        ref={ref1}
        value={number.length > 3 ? number.substring(3, 6) : ""}
        onKeyDown={handleKeyPress}
        onChange={(e) => setNumber(number.substring(0, 3) + e.target.value)}
      />
      <input
        className="phone-4 rounded-pill text-center"
        ref={ref2}
        value={number.length > 6 ? number.substring(6, 10) : ""}
        onKeyDown={handleKeyPress}
        onChange={(e) => setNumber(number.substring(0, 6) + e.target.value)}
      />
    </div>
  );
}
