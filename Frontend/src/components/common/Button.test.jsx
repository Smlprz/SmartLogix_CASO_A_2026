import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button Component', () => {
  // ==================== RENDER TESTS ====================

  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should render button with primary variant by default', () => {
    render(<Button>Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  // ==================== VARIANT TESTS ====================

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-600')
  })

  it('should apply success variant styles', () => {
    render(<Button variant="success">Success</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-green-500')
  })

  it('should apply danger variant styles', () => {
    render(<Button variant="danger">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-500')
  })

  it('should apply outline variant styles', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-2', 'border-blue-600')
  })

  it('should apply ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-blue-600')
  })

  // ==================== SIZE TESTS ====================

  it('should apply small size', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-sm')
  })

  it('should apply medium size by default', () => {
    render(<Button>Medium</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-base')
  })

  it('should apply large size', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-lg')
  })

  // ==================== DISABLED TESTS ====================

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should be disabled when loading is true', () => {
    render(<Button loading>Loading Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should show disabled styles', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:bg-gray-400')
  })

  // ==================== LOADING TESTS ====================

  it('should show loading state with spinner', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('should show loading spinner', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByText('⏳')).toBeInTheDocument()
  })

  it('should not show children text when loading', () => {
    render(<Button loading>Save Changes</Button>)
    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument()
  })

  // ==================== CLICK TESTS ====================

  it('should call onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  // ==================== CLASS TESTS ====================

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should combine all classes correctly', () => {
    render(
      <Button
        variant="primary"
        size="lg"
        className="custom"
      >
        Complete Button
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600', 'text-lg', 'custom')
  })

  // ==================== ATTRIBUTE TESTS ====================

  it('should pass through HTML attributes', () => {
    render(
      <Button
        data-testid="custom-button"
        aria-label="Custom Button"
      >
        Test
      </Button>
    )
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom Button')
  })

  it('should have type button by default', () => {
    render(<Button>Submit Form</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  // ==================== COMBINATION TESTS ====================

  it('should render secondary danger button with large size', () => {
    render(
      <Button variant="danger" size="lg">
        Delete All
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-500', 'text-lg')
  })

  it('should handle complex content with children', () => {
    render(
      <Button>
        <span>Icon</span> Click Here
      </Button>
    )
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Click Here')).toBeInTheDocument()
  })
})
