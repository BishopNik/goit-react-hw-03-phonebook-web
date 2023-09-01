/** @format */

import { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

class ContactList extends Component {
	static propTypes = {
		contacts: PropTypes.arrayOf(
			PropTypes.exact({
				id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				number: PropTypes.string.isRequired,
			})
		).isRequired,
		filter: PropTypes.string,
		onDeleteContact: PropTypes.func.isRequired,
		onEdit: PropTypes.func.isRequired,
		enable: PropTypes.bool.isRequired,
	};

	render() {
		return (
			<>
				{this.props.contacts
					.filter(contact => {
						const searchName = contact.name.toLowerCase();
						const filterName = this.props.filter.toLowerCase();
						return searchName.includes(filterName);
					})
					.map(({ id, name, number }) => (
						<div
							className='contact-containet'
							key={id}
							onClick={this.props.onEdit}
							data-id={id}
							data-name={name}
							data-number={number}
						>
							<p className='contact'>
								{name} {number}
							</p>
							<button
								id={id}
								className='del-button button'
								type='submit'
								onClick={this.props.onDeleteContact}
								disabled={this.props.enable}
							>
								Delete
							</button>
						</div>
					))}
			</>
		);
	}
}

export default ContactList;
