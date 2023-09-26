/** @format */

import PropTypes from 'prop-types';
import './style.css';

const Filter = ({ value, onFiltred }) => {
	return (
		<label className='filter-field'>
			Find contacts by name
			<input
				className='input-field filter'
				value={value}
				type='text'
				name='filter'
				autoComplete='off'
				onChange={onFiltred}
			/>
		</label>
	);
};

Filter.propTypes = {
	value: PropTypes.string.isRequired,
	onFiltred: PropTypes.func.isRequired,
};

export default Filter;
