import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hashPin } from '../../src/store/pin';
import PinGate from '../../src/components/PinGate';

function makeStore(pinHash) {
  return { user: { pinHash } };
}

function setup() {
  return userEvent.setup({ delay: null });
}

describe('PinGate', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows PIN entry form when locked, not children', () => {
    const store = makeStore(hashPin('1234'));
    render(
      <PinGate store={store} onWipe={() => {}}>
        <div>Secret Content</div>
      </PinGate>
    );
    expect(screen.getByLabelText(/PIN/i)).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('shows children after correct PIN entered', async () => {
    const user = setup();
    const store = makeStore(hashPin('1234'));
    render(
      <PinGate store={store} onWipe={() => {}}>
        <div>Secret Content</div>
      </PinGate>
    );
    await user.type(screen.getByLabelText(/PIN/i), '1234');
    await user.click(screen.getByRole('button', { name: /unlock/i }));
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('shows error message on wrong PIN', async () => {
    const user = setup();
    const store = makeStore(hashPin('1234'));
    render(
      <PinGate store={store} onWipe={() => {}}>
        <div>Secret Content</div>
      </PinGate>
    );
    await user.type(screen.getByLabelText(/PIN/i), '0000');
    await user.click(screen.getByRole('button', { name: /unlock/i }));
    expect(screen.getByText(/incorrect pin/i)).toBeInTheDocument();
    expect(screen.getByText(/attempts remaining/i)).toBeInTheDocument();
  });

  it('shows lockout message after 5 failed attempts', async () => {
    const user = setup();
    const store = makeStore(hashPin('1234'));
    render(
      <PinGate store={store} onWipe={() => {}}>
        <div>Secret Content</div>
      </PinGate>
    );
    for (let i = 0; i < 5; i++) {
      const input = screen.getByLabelText(/PIN/i);
      await user.clear(input);
      await user.type(input, '0000');
      await user.click(screen.getByRole('button', { name: /unlock/i }));
    }
    expect(screen.getByText(/locked out/i)).toBeInTheDocument();
  });
});
