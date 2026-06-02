# 🧪 Frontend Testing Guide - Vite + React + Vitest

## Configuración Completada

Se han agregado tests de React para el frontend usando:
- **Vitest** - Test runner (alternativa a Jest para Vite)
- **@testing-library/react** - Testing de componentes React
- **@testing-library/user-event** - Simulación de eventos de usuario

## Instalación de Dependencias

```bash
# En la carpeta Frontend
cd C:\Users\smlpr\OneDrive\Escritorio\Actualizacion de repo SmartLogix\SmartLogix_CASO_A_2026\Frontend

# Instala todas las dependencias (incluyendo testing)
npm install
```

## Scripts de Testing

Ahora tienes disponibles estos comandos:

```bash
# Ejecutar tests en modo watch (ideal para desarrollo)
npm run test

# Ejecutar tests con interfaz visual
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar tests una sola vez (para CI/CD)
npm run test -- --run
```

## Archivos de Test Creados

```
Frontend/
├── vitest.config.js              # Configuración de Vitest
├── src/
│   ├── test/
│   │   └── setup.js             # Setup de tests (mocks, cleanup)
│   └── components/
│       └── common/
│           ├── Button.jsx
│           ├── Button.test.jsx   # 25 tests para Button
│           ├── Input.jsx
│           └── Input.test.jsx    # 30 tests para Input
```

## Test Coverage

### Button Component Tests (25 tests)
- ✅ Render tests (render, text content)
- ✅ Variant styles (primary, secondary, success, danger, outline, ghost)
- ✅ Size styles (small, medium, large)
- ✅ Disabled state handling
- ✅ Loading state with spinner
- ✅ Click handlers
- ✅ Custom classes
- ✅ HTML attributes

### Input Component Tests (30 tests)
- ✅ Basic rendering
- ✅ Label rendering
- ✅ Required field indicator
- ✅ Error message display
- ✅ Error styles (border color, focus ring)
- ✅ User input handling
- ✅ Input type support (email, password, text)
- ✅ Disabled state
- ✅ Custom styling
- ✅ Complete form field integration

## Ejecutar Tests

### Opción 1: Modo Watch (Desarrollo)
```bash
npm run test
```
Los tests se ejecutarán cada vez que cambies un archivo. Presiona:
- `a` - ejecutar todos los tests
- `f` - ejecutar tests que fallaron
- `p` - filtrar por nombre de archivo
- `q` - salir

### Opción 2: Interfaz Visual (Recomendado)
```bash
npm run test:ui
```
Se abrirá una interfaz web en `http://localhost:51204/` donde puedes:
- Ver todos los tests gráficamente
- Ejecutar tests individuales
- Ver cobertura en tiempo real
- Debuggear tests

### Opción 3: Reporte de Cobertura
```bash
npm run test:coverage
```
Genera un reporte en `coverage/` con cobertura de líneas, branches, funciones, etc.

## Estructura de un Test

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button Component', () => {
  it('should render button with text', () => {
    // Arrange (preparar)
    render(<Button>Click me</Button>)

    // Act (actuar)
    // ... user actions ...

    // Assert (verificar)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## Patrón AAA (Arrange, Act, Assert)

```javascript
it('should call onClick when clicked', async () => {
  // 1. ARRANGE - Preparar
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click</Button>)

  // 2. ACT - Ejecutar
  await user.click(screen.getByRole('button'))

  // 3. ASSERT - Verificar
  expect(handleClick).toHaveBeenCalledOnce()
})
```

## Utilities Comunes

### Queries
```javascript
screen.getByRole('button')      // Obtener por role ARIA
screen.getByText('texto')       // Obtener por texto
screen.getByPlaceholder('texto') // Obtener por placeholder
screen.getByTestId('id')        // Obtener por data-testid
screen.queryBy...               // Retorna null si no encuentra
screen.findBy...                // Async, espera a que aparezca
```

### Assertions
```javascript
expect(element).toBeInTheDocument()
expect(element).toBeDisabled()
expect(element).toHaveClass('class-name')
expect(element).toHaveAttribute('attr', 'value')
expect(element).toHaveValue('value')
expect(element).toHaveTextContent('text')
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith('args')
```

### User Events
```javascript
const user = userEvent.setup()
await user.click(element)
await user.type(element, 'text')
await user.clear(element)
await user.keyboard('{Tab}')
```

## Próximos Pasos

1. **Crear tests para más componentes**:
   - Card.jsx
   - Modal.jsx
   - Table.jsx
   - Login.jsx
   - Dashboard.jsx

2. **Tests de integración**:
   - Flujos completos (login + dashboard)
   - Interacciones entre componentes

3. **Mock de APIs**:
   - Mock de axios/fetch
   - Mock de services
   - Mock de contextos

4. **E2E Testing** (opcional):
   - Usar Playwright o Cypress
   - Tests en navegador real
   - Automatizar flows completos

## Tips para Testing

✅ **DO:**
- Testea comportamiento, no implementación
- Usa queries que usan usuarios reales (getByRole, getByText)
- Testea la interfaz, no el código interno
- Agrupa tests relacionados en describe blocks
- Usa nombres descriptivos para tests

❌ **DON'T:**
- No testees HTML internals
- No uses selectores de CSS en tests
- No esperes valores específicos de props
- No mockees más de lo necesario
- No hagas tests demasiado complejos

## Cobertura Esperada

Con los tests actuales:
- **Button**: ~90-95% coverage
- **Input**: ~85-90% coverage

Meta general: **>80% coverage** en toda la aplicación

## Troubleshooting

### Error: "jsdom is not installed"
```bash
npm install --save-dev jsdom
```

### Los tests no encuentran componentes
- Verifica la ruta en el import
- Asegúrate que el archivo .jsx existe
- Revisa el path en vitest.config.js

### Errores de módulos no encontrados
```bash
# Limpia node_modules y reinstala
rm -r node_modules package-lock.json
npm install
```

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
