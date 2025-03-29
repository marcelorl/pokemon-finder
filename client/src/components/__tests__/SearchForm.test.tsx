import { render } from '../../test-utils';
import { describe, expect, it, vi } from 'vitest';
import { SearchForm } from '../SearchForm';
import { SearchFilters } from '../../types/pokemon';

describe('SearchForm', () => {
  it('renders correctly with default values', () => {
    const { getByPlaceholderText, getByText, getByLabelText } = render(
        <SearchForm onSearch={() => {}} />
    );

    expect(getByPlaceholderText('Enter a name...')).toBeInTheDocument();
    expect(getByText('Search')).toBeInTheDocument();
    expect(getByLabelText('Filter by Type')).toBeInTheDocument();
  });

  it('renders with custom default values', () => {
    const defaultValues: SearchFilters = {
      name: 'pikachu',
      type: 'electric'
    };

    const { getByPlaceholderText, getByRole } = render(
        <SearchForm onSearch={() => {}} defaultValues={defaultValues} />
    );

    const input = getByPlaceholderText('Enter a name...') as HTMLInputElement;
    expect(input.value).toBe('pikachu');

    const select = getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('electric');
  });

  it('calls onSearch with correct normalized values when form is submitted', async () => {
    const onSearchMock = vi.fn();
    const { getByPlaceholderText, getByText, user } = render(
        <SearchForm onSearch={onSearchMock} />
    );

    const input = getByPlaceholderText('Enter a name...') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '  Charizard  ');

    const searchButton = getByText('Search');
    await user.click(searchButton);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith({
      name: 'Charizard',
      type: 'all' // Default type is 'all' now
    });
  });

  it('allows selecting a Pokémon type', async () => {
    const onSearchMock = vi.fn();
    const { getByText, getByRole, user } = render(
        <SearchForm onSearch={onSearchMock} />
    );

    const select = getByRole('combobox') as HTMLSelectElement;
    await user.selectOptions(select, 'fire');

    await user.click(getByText('Search'));

    expect(onSearchMock).toHaveBeenCalledWith({
      name: '',
      type: 'fire'
    });
  });
});