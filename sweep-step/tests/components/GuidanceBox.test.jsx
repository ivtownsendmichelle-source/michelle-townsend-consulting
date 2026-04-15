import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuidanceBox } from '../../src/components/GuidanceBox';

describe('GuidanceBox', () => {
  const original = 'Original guidance text';
  const modern = 'Modern guidance text';

  it('shows original guidance by default', () => {
    render(<GuidanceBox original={original} modern={modern} />);
    expect(screen.getByText(original)).toBeInTheDocument();
    expect(screen.queryByText(modern)).not.toBeInTheDocument();
  });

  it('shows modern guidance when "Learn more" is tapped', async () => {
    const user = userEvent.setup({ delay: null });
    render(<GuidanceBox original={original} modern={modern} />);
    await user.click(screen.getByRole('button', { name: /learn more/i }));
    expect(screen.getByText(modern)).toBeInTheDocument();
  });

  it('hides modern guidance and changes button text when toggled back', async () => {
    const user = userEvent.setup({ delay: null });
    render(<GuidanceBox original={original} modern={modern} />);
    await user.click(screen.getByRole('button', { name: /learn more/i }));
    expect(screen.getByText(modern)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /show less/i }));
    expect(screen.queryByText(modern)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
  });
});
