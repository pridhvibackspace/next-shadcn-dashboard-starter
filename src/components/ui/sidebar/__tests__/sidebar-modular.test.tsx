import { render } from '@testing-library/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '../index';

// Mock the mobile hook
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

describe('Sidebar Modular Components', () => {
  it('renders SidebarProvider without errors', () => {
    render(
      <SidebarProvider>
        <div>Test content</div>
      </SidebarProvider>
    );
  });

  it('renders complete sidebar structure', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <h2>Header</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Menu Item</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <p>Footer</p>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );
  });

  it('exports all required components', () => {
    expect(SidebarProvider).toBeDefined();
    expect(Sidebar).toBeDefined();
    expect(SidebarContent).toBeDefined();
    expect(SidebarHeader).toBeDefined();
    expect(SidebarFooter).toBeDefined();
    expect(SidebarMenu).toBeDefined();
    expect(SidebarMenuItem).toBeDefined();
    expect(SidebarMenuButton).toBeDefined();
  });
});
