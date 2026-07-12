import React from 'react';
import { JBPinInput } from 'jb-pin-input/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../../docs/styles/ant-design.css';
import '../../../docs/styles/aurora.css';
import '../../../docs/styles/bootstrap.css';
import '../../../docs/styles/candy.css';
import '../../../docs/styles/carbon.css';
import '../../../docs/styles/cupertino.css';
import '../../../docs/styles/fluent.css';
import '../../../docs/styles/forest.css';
import '../../../docs/styles/material.css';
import '../../../docs/styles/porcelain.css';
import '../../../docs/styles/sunset.css';
import '../../../docs/styles/terminal.css';
import './styles/style-ant-design.css';
import './styles/style-aurora.css';
import './styles/style-bootstrap.css';
import './styles/style-candy.css';
import './styles/style-carbon.css';
import './styles/style-cupertino.css';
import './styles/style-fluent.css';
import './styles/style-forest.css';
import './styles/style-material.css';
import './styles/style-porcelain.css';
import './styles/style-sunset.css';
import './styles/style-terminal.css';

const meta = {
  title: "Components/form elements/JBPinInput/Style",
  component: JBPinInput,
} satisfies Meta<typeof JBPinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const styleSamples = [
  { name: "Carbon", className: "carbon-style carbon-style" },
  { name: "Aurora", className: "aurora-style aurora-style" },
  { name: "Forest", className: "forest-style forest-style" },
  { name: "Sunset", className: "sunset-style sunset-style" },
  { name: "Porcelain", className: "porcelain-style porcelain-style" },
  { name: "Candy", className: "candy-style candy-style" },
  { name: "Terminal", className: "terminal-style terminal-style" },
  { name: "Material", className: "material-style material-style" },
  { name: "Fluent", className: "fluent-style fluent-style" },
  { name: "Bootstrap", className: "bootstrap-style bootstrap-style" },
  { name: "Cupertino", className: "cupertino-style cupertino-style" },
  { name: "Ant Design", className: "ant-design-style" },
];

function PinInputStyleSample({ className }: { className: string }) {
  return (
    <div style={{ display: "grid", gap: "1rem", width: "100%" }}>
      <JBPinInput className={className} charLength={4} value="2846" message="Verification code" />
      <JBPinInput className={className} charLength={6} value="839174" message="Six digit code" />
      <JBPinInput className={className} charLength={4} value="1084" error="Invalid verification code" />
    </div>
  );
}

export const Gallery: Story = {
  name: "Gallery",
  render: () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
      gap: "1.25rem",
      alignItems: "start",
      width: "min(100%, 82rem)",
    }}>
      {styleSamples.map((sample) => (
        <section
          key={sample.className}
          style={{
            display: "grid",
            gap: "0.75rem",
            minWidth: 0,
            padding: "1rem",
            background: "var(--jb-surface)",
            border: "1px solid var(--jb-border-color)",
            borderRadius: "var(--jb-radius)",
            boxShadow: "0 0.75rem 1.75rem oklch(0% 0 0 / 0.08)",
          }}
          className={sample.className.split(" ")[0]}
        >
          <div style={{
            width: "100%",
            color: "var(--jb-text-primary)",
            fontSize: "0.875rem",
            fontWeight: 700,
            lineHeight: 1.4,
            textAlign: "center",
          }}>
            {sample.name}
          </div>
          <PinInputStyleSample className={sample.className} />
        </section>
      ))}
    </div>
  ),
};

export const Default: Story = { name: "Default", render: () => <PinInputStyleSample className="" /> };
export const Carbon: Story = { name: "Carbon", render: () => <PinInputStyleSample className="carbon-style carbon-style" /> };
export const Aurora: Story = { name: "Aurora", render: () => <PinInputStyleSample className="aurora-style aurora-style" /> };
export const Forest: Story = { name: "Forest", render: () => <PinInputStyleSample className="forest-style forest-style" /> };
export const Sunset: Story = { name: "Sunset", render: () => <PinInputStyleSample className="sunset-style sunset-style" /> };
export const Porcelain: Story = { name: "Porcelain", render: () => <PinInputStyleSample className="porcelain-style porcelain-style" /> };
export const Candy: Story = { name: "Candy", render: () => <PinInputStyleSample className="candy-style candy-style" /> };
export const Terminal: Story = { name: "Terminal", render: () => <PinInputStyleSample className="terminal-style terminal-style" /> };
export const Material: Story = { name: "Material", render: () => <PinInputStyleSample className="material-style material-style" /> };
export const Fluent: Story = { name: "Fluent", render: () => <PinInputStyleSample className="fluent-style fluent-style" /> };
export const Bootstrap: Story = { name: "Bootstrap", render: () => <PinInputStyleSample className="bootstrap-style bootstrap-style" /> };
export const Cupertino: Story = { name: "Cupertino", render: () => <PinInputStyleSample className="cupertino-style cupertino-style" /> };
export const AntDesign: Story = { name: "Ant Design", render: () => <PinInputStyleSample className="ant-design-style" /> };
