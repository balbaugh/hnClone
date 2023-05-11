import * as React from 'react';
import { sortBy } from 'lodash';

import { ReactComponent as Check } from '../assets/check.svg';

const SORTS = {
	NONE: (list) => list,
	TITLE: (list) => sortBy(list, 'title'),
	AUTHOR: (list) => sortBy(list, 'author'),
	COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
	POINT: (list) => sortBy(list, 'points').reverse(),
};

const List = React.memo(({ list, onRemoveItem }) => {
	const [sort, setSort] = React.useState('NONE');

	const handleSort = (sortKey) => {
		setSort(sortKey);
	};

	const sortFunction = SORTS[sort];
	const sortedList = sortFunction(list);

	return (
		<ul>
			<li style={{ display: 'flex' }}>
				<span style={{ width: '40%' }}>
					<button
						type='button'
						onClick={() => handleSort('TITLE')}
						className='button'
					>
						Title
					</button>
				</span>
				<span style={{ width: '30%' }}>
					<button
						type='button'
						onClick={() => handleSort('AUTHOR')}
						className='button'
					>
						Author
					</button>
				</span>
				<span style={{ width: '10%' }}>
					<button
						type='button'
						onClick={() => handleSort('COMMENT')}
						className='button'
					>
						Comments
					</button>
				</span>
				<span style={{ width: '10%' }}>
					<button
						type='button'
						onClick={() => handleSort('POINT')}
						className='button'
					>
						Points
					</button>
				</span>
				<span style={{ width: '10%' }}>Actions</span>
			</li>

			{sortedList.map((item) => (
				<Item
					key={item.objectID}
					item={item}
					onRemoveItem={onRemoveItem}
				/>
			))}
		</ul>
	);
});

const Item = ({ item, onRemoveItem }) => (
	<li
		style={{ display: 'flex' }}
		className='item'
	>
		<span style={{ width: '40%' }}>
			<a href={item.url}>{item.title}</a>
		</span>
		<span style={{ width: '30%' }}>{item.author}</span>
		<span style={{ width: '10%' }}>{item.num_comments}</span>
		<span style={{ width: '10%' }}>{item.points}</span>
		<span style={{ width: '10%' }}>
			<button
				type='button'
				onClick={() => onRemoveItem(item)}
				className='button buttonSmall'
			>
				<Check
					height='18px'
					width='18px'
				/>
			</button>
		</span>
	</li>
);

List.displayName = 'List';

export { List };
