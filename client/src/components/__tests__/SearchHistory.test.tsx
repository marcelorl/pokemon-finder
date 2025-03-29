import { render } from '../../test-utils';
import { describe, expect, it, vi } from 'vitest';
import { SearchHistory } from '../SearchHistory';
import { SearchHistoryItem } from '../../types/pokemon';

describe('SearchHistory', () => {
  const mockHistory: SearchHistoryItem[] = [
    { term: 'pikachu', type: 'electric', timestamp: '2023-03-15T10:30:00Z' },
    { term: 'charizard', type: 'fire', timestamp: '2023-03-15T10:35:00Z' },
    { term: 'bulbasaur', type: '', timestamp: '2023-03-15T10:40:00Z' },
  ];

  it('renders correctly with history items', () => {
    const { getByText } = render(
        <SearchHistory
            history={mockHistory}
            onClearHistory={() => {}}
            onSelectHistory={() => {}}
        />
    );

    expect(getByText('Search History')).toBeInTheDocument();
    expect(getByText('pikachu')).toBeInTheDocument();
    expect(getByText('charizard')).toBeInTheDocument();
    expect(getByText('bulbasaur')).toBeInTheDocument();

    // Check timestamps are displayed
    expect(getByText('2023-03-15T10:30:00Z')).toBeInTheDocument();
    expect(getByText('2023-03-15T10:35:00Z')).toBeInTheDocument();
    expect(getByText('2023-03-15T10:40:00Z')).toBeInTheDocument();
  });

  it('displays empty state message when history is empty', () => {
    const { getByText } = render(
        <SearchHistory
            history={[]}
            onClearHistory={() => {}}
            onSelectHistory={() => {}}
        />
    );

    expect(getByText('No search history yet.')).toBeInTheDocument();
  });

  it('calls onClearHistory when clear button is clicked', async () => {
    const onClearHistoryMock = vi.fn();
    const { getByText, user } = render(
        <SearchHistory
            history={mockHistory}
            onClearHistory={onClearHistoryMock}
            onSelectHistory={() => {}}
        />
    );

    const clearButton = getByText('Clear All');
    await user.click(clearButton);

    expect(onClearHistoryMock).toHaveBeenCalledTimes(1);
  });

  it('calls onSelectHistory with correct filters when history item is clicked', async () => {
    const onSelectHistoryMock = vi.fn();
    const { getByText, user } = render(
        <SearchHistory
            history={mockHistory}
            onClearHistory={() => {}}
            onSelectHistory={onSelectHistoryMock}
        />
    );

    const pikachuItem = getByText('pikachu').closest('div');
    await user.click(pikachuItem as HTMLElement);

    expect(onSelectHistoryMock).toHaveBeenCalledTimes(1);
    expect(onSelectHistoryMock).toHaveBeenCalledWith({
      name: 'pikachu',
      type: 'electric'
    });
  });
});