import { render } from '@testing-library/react';
import { ChartContainer, ChartStyle } from '../chart';

// Mock recharts to avoid issues with the ResponsiveContainer
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  )
}));

describe('ChartStyle Security Tests', () => {
  it('should validate CSS colors to prevent injection attacks', () => {
    const validConfig = {
      test: { color: '#ff0000' }
    };
    
    const { container } = render(<ChartStyle id="test-chart" config={validConfig} />);
    const styleElement = container.querySelector('style');
    
    expect(styleElement).toBeTruthy();
    expect(styleElement?.innerHTML).toContain('--color-test: #ff0000;');
  });

  it('should reject invalid CSS colors and prevent injection', () => {
    const maliciousConfig = {
      test: { color: 'red; } body { background: url(evil.com); } /*' }
    };
    
    const { container } = render(<ChartStyle id="test-chart" config={maliciousConfig} />);
    const styleElement = container.querySelector('style');
    
    // The malicious color should be filtered out
    expect(styleElement?.innerHTML).not.toContain('evil.com');
    expect(styleElement?.innerHTML).not.toContain('background: url');
  });

  it('should allow valid color formats', () => {
    const validConfigs = [
      { hex6: { color: '#ffffff' } },
      { hex3: { color: '#fff' } },
      { rgb: { color: 'rgb(255, 255, 255)' } },
      { hsl: { color: 'hsl(0, 100%, 50%)' } },
      { cssVar: { color: 'var(--primary)' } },
      { named: { color: 'red' } }
    ];

    validConfigs.forEach((config, index) => {
      const { container } = render(<ChartStyle id={`test-${index}`} config={config} />);
      const styleElement = container.querySelector('style');
      expect(styleElement?.innerHTML).toBeTruthy();
    });
  });

  it('should reject empty or undefined colors', () => {
    const invalidConfig = {
      empty: { color: '' },
      undefined: {},
      null: { color: null as any }
    };
    
    const { container } = render(<ChartStyle id="test-chart" config={invalidConfig} />);
    const styleElement = container.querySelector('style');
    
    // Should not contain any color definitions for invalid colors
    // If no valid colors, the style element should not exist or be empty
    if (styleElement) {
      expect(styleElement.innerHTML).not.toContain('--color-empty');
      expect(styleElement.innerHTML).not.toContain('--color-undefined');
      expect(styleElement.innerHTML).not.toContain('--color-null');
    }
  });
});

describe('ChartContainer', () => {
  it('should render chart container with proper security attributes', () => {
    const config = {
      test: { color: '#ff0000' }
    };
    
    const { container } = render(
      <ChartContainer config={config}>
        <div>Chart content</div>
      </ChartContainer>
    );
    
    const chartDiv = container.querySelector('[data-slot="chart"]');
    expect(chartDiv).toBeTruthy();
    expect(chartDiv?.getAttribute('data-chart')).toMatch(/^chart-/);
  });
});