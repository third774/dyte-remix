/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ButtonLink } from './Button';
import { MemoryRouter } from 'react-router';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-indigo-600'); // primary variant
    expect(button).toHaveClass('px-4 py-2'); // md size
    expect(button).not.toBeDisabled();
  });

  it('renders with custom props', () => {
    render(
      <Button variant="secondary" size="lg" disabled className="custom-class">
        Custom Button
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /custom button/i });
    
    expect(button).toHaveClass('bg-blue-500'); // secondary variant
    expect(button).toHaveClass('px-6 py-3'); // lg size
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('opacity-50');
    expect(button).toBeDisabled();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('ButtonLink', () => {
  it('renders with default props', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/some-path">Link Button</ButtonLink>
      </MemoryRouter>
    );
    
    const link = screen.getByRole('link', { name: /link button/i });
    
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('bg-indigo-600'); // primary variant
    expect(link).toHaveClass('px-4 py-2'); // md size
    expect(link).toHaveAttribute('href', '/some-path');
  });

  it('renders with custom props', () => {
    render(
      <MemoryRouter>
        <ButtonLink 
          to="/some-path" 
          variant="outline" 
          size="sm" 
          disabled 
          className="custom-class"
        >
          Custom Link
        </ButtonLink>
      </MemoryRouter>
    );
    
    const link = screen.getByRole('link', { name: /custom link/i });
    
    expect(link).toHaveClass('border-gray-300'); // outline variant
    expect(link).toHaveClass('px-2.5 py-1.5'); // sm size
    expect(link).toHaveClass('custom-class');
    expect(link).toHaveClass('pointer-events-none');
  });

  it('prevents default when disabled and clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <ButtonLink to="/some-path" onClick={handleClick} disabled>
          Disabled Link
        </ButtonLink>
      </MemoryRouter>
    );
    
    const link = screen.getByRole('link', { name: /disabled link/i });
    
    await user.click(link);
    expect(handleClick).not.toHaveBeenCalled();
  });
});