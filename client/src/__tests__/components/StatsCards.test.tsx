
import { render, screen } from '@testing-library/react';
import { StatsCards } from '../../components/stats-cards';

const mockStats = {
  totalPosts: 42,
  scheduledPosts: 8,
  totalViews: 1250,
  engagement: 85
};

describe('StatsCards', () => {
  it('displays stats correctly', () => {
    render(<StatsCards stats={mockStats} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('shows loading state when stats are undefined', () => {
    render(<StatsCards stats={undefined} />);
    
    // Should show skeleton loaders or loading indicators
    const skeletons = screen.getAllByTestId(/skeleton/i);
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
