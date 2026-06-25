import React from 'react';
import "./JBPinInputStyleTest.css";
import { JBPinInput } from "jb-pin-input/react";

const variableSamples = [
  {
    className: "pin-token-minimal",
    title: "Minimal underline",
    message: "Only a calm active line and compact digits.",
    value: "8391",
    charLength: 4,
  },
  {
    className: "pin-token-boxed",
    title: "Boxed login",
    message: "Bordered cells without part selectors.",
    value: "2846",
    charLength: 4,
  },
  {
    className: "pin-token-wide",
    title: "Wide receipt",
    message: "A wider row and more space between cells.",
    value: "420918",
    charLength: 6,
  },
  {
    className: "pin-token-compact",
    title: "Compact code",
    message: "Small cells for dense confirmation forms.",
    value: "527639",
    charLength: 6,
  },
  {
    className: "pin-token-payment",
    title: "Payment approval",
    message: "Warm colors and stronger active underline.",
    value: "7592",
    charLength: 4,
  },
  {
    className: "pin-token-error",
    title: "Error tokens",
    message: "Invalid verification code.",
    value: "1084",
    charLength: 4,
    error: "Invalid verification code.",
  },
];

const partSamples = [
  {
    className: "pin-part-stepped",
    title: "Stepped access",
    message: "Index parts highlight the first and last cells.",
    value: "492781",
    charLength: 6,
  },
  {
    className: "pin-part-capsule",
    title: "Capsule cells",
    message: "Parts style the wrapper, input, and message.",
    value: "3074",
    charLength: 4,
  },
  {
    className: "pin-part-ticket",
    title: "Ticket split",
    message: "Indexed line parts mark the middle pair.",
    value: "628145",
    charLength: 6,
  },
  {
    className: "pin-part-keypad",
    title: "Soft keypad",
    message: "Large touch targets with row part styling.",
    value: "8156",
    charLength: 4,
  },
  {
    className: "pin-part-focus",
    title: "Focus markers",
    message: "Indexed input parts add a visual rhythm.",
    value: "603914",
    charLength: 6,
  },
  {
    className: "pin-part-danger",
    title: "Blocked code",
    message: "Error styling with a pill message part.",
    value: "190284",
    charLength: 6,
    error: "This verification code has expired.",
  },
];

function SampleCard({ sample }) {
  return (
    <section className={`pin-style-sample ${sample.className}`}>
      <div className="pin-style-copy">
        <h3>{sample.title}</h3>
        <p>{sample.message}</p>
      </div>
      <JBPinInput
        charLength={sample.charLength}
        value={sample.value}
        message={sample.message}
        error={sample.error}
      />
    </section>
  );
}

function SampleGroup({ title, description, samples }) {
  return (
    <section className="pin-style-group">
      <div className="pin-style-group-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="pin-input-style-grid">
        {samples.map((sample) => (
          <SampleCard sample={sample} key={sample.className} />
        ))}
      </div>
    </section>
  );
}

export function JBPinInputStyleTest() {
  return (
    <div className="pin-input-style-showcase">
      <SampleGroup
        title="CSS variable demos"
        description="These six examples only use JBPinInput CSS custom properties."
        samples={variableSamples}
      />
      <SampleGroup
        title="Part-based demos"
        description="These six examples combine custom properties with exported ::part selectors."
        samples={partSamples}
      />
    </div>
  );
}
