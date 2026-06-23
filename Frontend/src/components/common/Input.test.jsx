import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('Input Component', () => {
  // ==================== RENDER TESTS ====================

  it('should render input field', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render input with label', () => {
    render(<Input label="Username" />)
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('should render input without label when not provided', () => {
    const { container } = render(<Input />)
    const label = container.querySelector('label')
    expect(label).not.toBeInTheDocument()
  })

  // ==================== REQUIRED TESTS ====================

  it('should show required asterisk when required=true', () => {
    render(<Input label="Email" required={true} />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should not show required asterisk when required=false', () => {
    render(<Input label="Email" required={false} />)
    const asterisk = screen.queryByText('*')
    expect(asterisk).not.toBeInTheDocument()
  })

  it('should mark asterisk with red color', () => {
    const { container } = render(<Input label="Name" required={true} />)
    const asterisk = container.querySelector('.text-red-500')
    expect(asterisk).toBeInTheDocument()
    expect(asterisk.textContent).toBe('*')
  })

  // ==================== ERROR TESTS ====================

  it('should not display error when touched is false', () => {
    render(
      <Input
        label="Email"
        error="Email is required"
        touched={false}
      />
    )
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
  })

  it('should display error message when touched and error exist', () => {
    render(
      <Input
        label="Email"
        error="Email is required"
        touched={true}
      />
    )
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('should apply error styles when touched and error exist', () => {
    render(
      <Input
        error="Email is required"
        touched={true}
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })

  it('should apply normal styles when no error', () => {
    render(
      <Input
        error=""
        touched={true}
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-gray-300')
  })

  it('should apply red focus ring when error', () => {
    render(
      <Input
        error="Invalid input"
        touched={true}
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('focus:ring-red-500')
  })

  // ==================== USER INPUT TESTS ====================

  it('should accept user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello World')

    expect(input).toHaveValue('Hello World')
  })

  it('should update value on input change', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should handle input attributes', async () => {
    const user = userEvent.setup()
    render(
      <Input
        type="email"
        placeholder="Enter email"
        name="email"
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'Enter email')
    expect(input).toHaveAttribute('name', 'email')
  })

  // ==================== STYLING TESTS ====================

  it('should have full width class', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('w-full')
  })

  it('should have focus styles', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('focus:outline-none', 'focus:ring-2')
  })

  it('should have border and rounded styles', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border', 'rounded-lg')
  })

  it('should accept custom className', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  // ==================== PASSWORD INPUT TESTS ====================

  it('should support password input type', () => {
    const { container } = render(
      <Input
        type="password"
        label="Password"
      />
    )
    const input = container.querySelector('input[type="password"]')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should support email input type', () => {
    render(
      <Input
        type="email"
        label="Email"
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  // ==================== DISABLED TESTS ====================

  it('should support disabled state', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should not accept input when disabled', async () => {
    const user = userEvent.setup()
    render(<Input disabled />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(input).toHaveValue('')
  })

  // ==================== COMBINATION TESTS ====================

  it('should render complete form field with all props', () => {
    render(
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        required={true}
        error="Invalid email"
        touched={true}
      />
    )

    expect(screen.getByText('Email Address')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('Invalid email')).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'Enter your email')
    expect(input).toHaveClass('border-red-500')
  })

  it('should render valid input with all correct styles', () => {
    render(
      <Input
        label="Username"
        value="john_doe"
        required={true}
        touched={true}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('john_doe')
    expect(input).toHaveClass('border-gray-300')
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
  })
})
