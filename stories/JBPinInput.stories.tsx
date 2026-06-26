import React, { useRef, useState } from 'react';
import type { JBPinInputWebComponent } from 'jb-pin-input';
import { JBButton } from 'jb-button/react';
import { JBPinInput, type Props } from 'jb-pin-input/react';
import { JBPinInputStyleTest } from './samples/JBPinInputStyleTest';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<Props> = {
  title: "Components/form elements/JBPinInput",
  component: JBPinInput,
};
export default meta;
type Story = StoryObj<typeof JBPinInput>;

export const Normal: Story = {
  args: {
    label: 'pin input',
    message: "please fill the pin",
    value: "",
  }
};

export const AutoFocus: Story = {
  args: {
    label: 'autofocus',
    autofocus: true,
    value: "",
  }
};

export const charLength: Story = {
  args: {
    label: '8 digit pin',
    value: "",
    charLength: 8
  }
};

export const WithError: Story = {
  args: {
    label: 'with error',
    message: "simple message",
    error:"error message",
    value: "",
  }
};

export const Required: Story = {
  args: {
    label: 'required',
    required: true
  }
}
export const WithValidation: Story = {
  render:
    (args) => {
      const validationList = [
        {
          validator: (value:string) => {
            return value.startsWith("1");
          },
          message: "PIN must start with 1"
        }
      ];
      return (
        <div>
          <JBPinInput {...args} validationList={validationList} onComplete={(e) => console.log("complete", e)} required onChange={() => { console.log("change");}} />
        </div>
      );
    },
  args: {
    label: "Verification code",
    message: "Enter a code that starts with 1",
  }
};

export const ChecksumValidation: Story = {
  render:
    (args) => {
      const validationList = [
        {
          validator: (value:string) => {
            if (value.includes("-")) {
              return true;
            }
            const digits = value.split("").map(Number);
            const checksum = digits.slice(0, -1).reduce((sum, digit) => sum + digit, 0) % 10;
            return checksum === digits[digits.length - 1];
          },
          message: "Last digit must match the checksum",
        },
      ];
      return (
        <JBPinInput {...args} validationList={validationList} required onComplete={(e) => console.log("complete", e)} />
      );
    },
  args: {
    label: "Checksum PIN",
    charLength: 4,
    message: "Try 1236. The last digit must equal the sum of previous digits modulo 10.",
  }
};

export const AsyncValidation: Story = {
  render:
    (args) => {
      const validationList = [
        {
          validator: async (value:string) => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return value === "1234";
          },
          message: "Only 1234 is accepted",
          defer: true,
        },
      ];
      return (
        <JBPinInput {...args} validationList={validationList} required onComplete={(e) => console.log("complete", e)} />
      );
    },
  args: {
    label: "Async verification code",
    charLength: 4,
    message: "Enter 1234 and wait 3 seconds for async validation.",
  }
};

export const ManualValidation: Story = {
  render:
    (args) => {
      const pinInputRef = useRef<JBPinInputWebComponent>(null);
      const [validationResult, setValidationResult] = useState("Validation has not run yet.");
      const validationList = [
        {
          validator: (value:string) => value.startsWith("1"),
          message: "PIN must start with 1",
        },
      ];
      const validate = () => {
        const isValid = pinInputRef.current?.reportValidity() ?? false;
        const message = pinInputRef.current?.validationMessage;
        setValidationResult(isValid ? "Valid: reportValidity() returned true." : `Invalid: ${message}`);
      };
      return (
        <div style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
          <JBPinInput {...args} ref={pinInputRef} validationList={validationList} required />
          <JBButton type="button" onClick={validate}>Validate PIN</JBButton>
          <p aria-live="polite">{validationResult}</p>
        </div>
      );
    },
  args: {
    label: "Manual validation code",
    charLength: 4,
    message: "Click the button to run reportValidity().",
  }
};

export const PinInputStyle:Story = {
  render:() => <JBPinInputStyleTest></JBPinInputStyleTest>
}; 
