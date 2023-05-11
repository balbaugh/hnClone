import * as React from 'react';

import { InputWithLabel } from './InputWithLabel';

const SearchForm = ({
	searchTerm,
	onSearchInput,
	onSearchSubmit,
}) => (
	<form
		onSubmit={onSearchSubmit}
		className='searchForm'
	>
		<InputWithLabel
			id='search'
			value={searchTerm}
			isFocused
			onInputChange={onSearchInput}
		>
			<strong>Search:</strong>
		</InputWithLabel>

		<button
			type='submit'
			disabled={!searchTerm}
			className='button buttonLarge'
		>
			Submit
		</button>
	</form>
);

export { SearchForm };
