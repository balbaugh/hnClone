import * as React from 'react';
import axios from 'axios';

import { SearchForm } from './components/SearchForm';
import { List } from './components/List';

import './App.css';

const storiesReducer = (state, action) => {
	switch (action.type) {
		case 'STORIES_FETCH_INIT':
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case 'STORIES_FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				isError: false,
				data:
					action.payload.page === 0
						? action.payload.list
						: state.data.concat(action.payload.list),
				page: action.payload.page,
			};
		case 'STORIES_FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		case 'REMOVE_STORY':
			return {
				...state,
				data: state.data.filter(
					(story) =>
						action.payload.objectID !== story.objectID
				),
			};
		default:
			throw new Error();
	}
};

const useStorageState = (key, initialState) => {
	const isMounted = React.useRef(false);

	const [value, setValue] = React.useState(
		localStorage.getItem(key) || initialState
	);

	React.useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
		} else {
			localStorage.setItem(key, value);
		}
	}, [value, key]);

	return [value, setValue];
};

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const getUrl = (searchTerm, page) =>
	`${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const extractSearchTerm = (url) =>
	url
		.substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
		.replace(PARAM_SEARCH, '');

const getSumComments = (stories) => {
	return stories.data.reduce(
		(result, value) => result + value.num_comments,
		0
	);
};

const App = () => {
	const [searchTerm, setSearchTerm] = useStorageState(
		'search',
		'React'
	);

	const [url, setUrl] = React.useState([getUrl(searchTerm, 0)]);

	const [stories, dispatchStories] = React.useReducer(
		storiesReducer,
		{ data: [], page: 0, isLoading: false, isError: false }
	);

	const handleFetchStories = React.useCallback(async () => {
		dispatchStories({ type: 'STORIES_FETCH_INIT' });

		try {
			const result = await axios.get(url);

			dispatchStories({
				type: 'STORIES_FETCH_SUCCESS',
				payload: {
					list: result.data.hits,
					page: result.data.page,
				},
			});
		} catch {
			dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
		}
	}, [url]);

	React.useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	const handleRemoveStory = React.useCallback((item) => {
		dispatchStories({
			type: 'REMOVE_STORY',
			payload: item,
		});
	}, []);

	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearch = (searchTerm, page) => {
		const url = getUrl(searchTerm, page);
		setUrl(url.concat(url));
	};

	const handleSearchSubmit = (event) => {
		handleSearch(searchTerm, 0);
		event.preventDefault();
	};

	const handleMore = () => {
		const lastUrl = url[url.length - 1];
		const searchTerm = extractSearchTerm(lastUrl);
		handleSearch(searchTerm, stories.page + 1);
	};

	const sumComments = React.useMemo(
		() => getSumComments(stories),
		[stories]
	);

	return (
		<div className='container'>
			<h1 className='headlinePrimary'>
				My Hacker Stories with {sumComments} comments.
			</h1>

			<SearchForm
				searchTerm={searchTerm}
				onSearchInput={handleSearchInput}
				onSearchSubmit={handleSearchSubmit}
			/>

			<hr />

			{stories.isError && <p>Something went wrong ...</p>}

			<List
				list={stories.data}
				onRemoveItem={handleRemoveStory}
			/>

			{stories.isLoading ? (
				<p>Loading ...</p>
			) : (
				<button
					type='button'
					onClick={handleMore}
					className='button buttonLarge'
				>
					More
				</button>
			)}
		</div>
	);
};

export default App;
