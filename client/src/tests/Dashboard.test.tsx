import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../components/Dashboard';
import { AuthProvider } from '../hooks/use-auth';

// Mock the API requests
vi.mock('../lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
}));

// Mock auth hook
vi.mock('../hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user', role: 'admin' },
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock permissions
vi.mock('../lib/acl', () => ({
  getUserPermissions: () => ({
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageUsers: true,
  }),
}));

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={mockQueryClient}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </QueryClientProvider>
);

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with stats cards', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Active Orders')).toBeInTheDocument();
    expect(screen.getByText('In Transit')).toBeInTheDocument();
    expect(screen.getByText('Pending Quotes')).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
  });

  it('opens new order modal when button is clicked', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const newOrderButton = screen.getByText('New Order');
    fireEvent.click(newOrderButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Order')).toBeInTheDocument();
    });
  });

  it('validates required fields in new order form', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const newOrderButton = screen.getByText('New Order');
    fireEvent.click(newOrderButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Order')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create Order');
    fireEvent.click(createButton);

    // Should show validation errors for required fields
    await waitFor(() => {
      expect(screen.getByText('Origin Address *')).toBeInTheDocument();
      expect(screen.getByText('Destination Address *')).toBeInTheDocument();
    });
  });

  it('opens new lead modal when button is clicked', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const addLeadButton = screen.getByText('Add Lead');
    fireEvent.click(addLeadButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Lead')).toBeInTheDocument();
    });
  });

  it('validates required fields in new lead form', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const addLeadButton = screen.getByText('Add Lead');
    fireEvent.click(addLeadButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Lead')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add Lead');
    fireEvent.click(addButton);

    // Should show validation for required fields
    await waitFor(() => {
      expect(screen.getByText('Company Name *')).toBeInTheDocument();
      expect(screen.getByText('Contact Person *')).toBeInTheDocument();
    });
  });
});