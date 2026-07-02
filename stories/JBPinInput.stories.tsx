import React, { useRef, useState } from 'react';
import type { JBPinInputWebComponent } from 'jb-pin-input';
import { JBButton } from 'jb-button/react';
import { JBPinInput } from 'jb-pin-input/react';
import { JBPinInputStyleTest } from './samples/JBPinInputStyleTest';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from 'storybook/test';
import {
  dispatchPaste,
  getJBButton,
  getJBButtonNativeButton,
  getMessageText,
  getPinCells,
  getPinInput,
} from './test-utils';

const meta = {
  title: "Components/form elements/JBPinInput",
  component: JBPinInput,
} satisfies Meta<typeof JBPinInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    label: 'pin input',
    message: "please fill the pin",
    value: "",
  },
  play: async ({ canvasElement }) => {
    const pinInput = getPinInput(canvasElement);
    const inputs = getPinCells(pinInput);

    inputs[0].focus();
    await userEvent.keyboard('12a3');

    await waitFor(() => {
      expect(pinInput.value).toBe('123---');
      expect(inputs[0].value).toBe('1');
      expect(inputs[1].value).toBe('2');
      expect(inputs[2].value).toBe('3');
      expect(pinInput.shadowRoot?.activeElement).toBe(inputs[3]);
    });

    dispatchPaste(inputs[0], 'verification code: 987654');

    await waitFor(() => {
      expect(pinInput.value).toBe('987654');
      expect(inputs.map((input) => input.value).join('')).toBe('987654');
      expect(pinInput.shadowRoot?.activeElement).toBe(inputs[5]);
    });
  }
};

export const AutoFocus: Story = {
  args: {
    label: 'autofocus',
    autofocus: true,
    value: "",
  },
  play: async ({ canvasElement }) => {
    const pinInput = getPinInput(canvasElement);
    const inputs = getPinCells(pinInput);

    await waitFor(() => {
      expect(pinInput.shadowRoot?.activeElement).toBe(inputs[0]);
    });
  }
};

export const charLength: Story = {
  args: {
    label: '8 digit pin',
    value: "",
    charLength: 8
  },
  play: async ({ canvasElement }) => {
    const pinInput = getPinInput(canvasElement);

    await waitFor(() => {
      expect(getPinCells(pinInput)).toHaveLength(8);
      expect(pinInput.charLength).toBe(8);
    });

    pinInput.charLength = 4;

    await waitFor(() => {
      expect(getPinCells(pinInput)).toHaveLength(4);
      expect(pinInput.charLength).toBe(4);
      expect(pinInput.value).toBe('----');
    });
  }
};

export const WithError: Story = {
  args: {
    label: 'with error',
    message: "simple message",
    error:"error message",
    value: "",
  },
  play: async ({ canvasElement, args }) => {
    const pinInput = getPinInput(canvasElement);

    expect(pinInput.reportValidity()).toBe(false);

    await waitFor(() => {
      expect(getMessageText(pinInput)).toBe(args.error);
      expect(getPinCells(pinInput).every((input) => input.getAttribute('aria-invalid') === 'true')).toBe(true);
    });

    pinInput.setAttribute('error', '');

    await waitFor(() => {
      expect(pinInput.reportValidity()).toBe(true);
      expect(getMessageText(pinInput)).toBe(args.message);
      expect(getPinCells(pinInput).every((input) => !input.hasAttribute('aria-invalid'))).toBe(true);
    });
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
  },
  play: async ({ canvasElement, args }) => {
    const pinInput = getPinInput(canvasElement);

    pinInput.value = '234567';
    expect(pinInput.reportValidity()).toBe(false);

    await waitFor(() => {
      expect(getMessageText(pinInput)).toBe('PIN must start with 1');
      expect(getPinCells(pinInput).every((input) => input.getAttribute('aria-invalid') === 'true')).toBe(true);
    });

    pinInput.value = '123456';
    expect(pinInput.reportValidity()).toBe(true);

    await waitFor(() => {
      expect(getMessageText(pinInput)).toBe(args.message);
    });
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
  },
  play: async ({ canvasElement, args }) => {
    const pinInput = getPinInput(canvasElement);

    pinInput.value = '9999';
    const invalidResult = await pinInput.validation.checkValidity({ showError: true });

    expect(invalidResult.isAllValid).toBe(false);

    await waitFor(() => {
      expect(getMessageText(pinInput)).toBe('Only 1234 is accepted');
    });

    pinInput.value = '1234';
    const validResult = await pinInput.validation.checkValidity({ showError: true });

    expect(validResult.isAllValid).toBe(true);

    await waitFor(() => {
      expect(getMessageText(pinInput)).toBe(args.message);
    });
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
  },
  play: async ({ canvasElement }) => {
    const pinInput = getPinInput(canvasElement);
    const validateButton = getJBButton(canvasElement, 'Validate PIN');

    await userEvent.click(getJBButtonNativeButton(validateButton));

    await waitFor(() => {
      expect(canvasElement).toHaveTextContent('Invalid:');
    });

    pinInput.value = '1234';
    await userEvent.click(getJBButtonNativeButton(validateButton));

    await waitFor(() => {
      expect(canvasElement).toHaveTextContent('Valid: reportValidity() returned true.');
    });
  }
};

export const PinInputStyle:Story = {
  render:() => <JBPinInputStyleTest></JBPinInputStyleTest>
}; 
