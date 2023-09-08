/** @format */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { Notify } from 'notiflix';
import * as API from './fetch_api';
import Filter from './filter';
import ContactList from './contact';
import ContactForm from './forms';
import './style.css';

class App extends Component {
	state = {
		contacts: [
			{ id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
			{ id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
			{ id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
			{ id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
		],
		contact: { id: '', name: '', number: '', edit: false },
		filter: '',
		active: false,
		button: 'Add contact',
	};

	static propTypes = {
		name: PropTypes.string,
		number: PropTypes.string,
	};

	async componentDidMount() {
		try {
			const savedContacts = await API.fetchGet();
			if (savedContacts.length > 0) {
				this.setState({ contacts: savedContacts, filter: '' });
			}
		} catch ({ message }) {
			Notify.failure(`${message}`);
		}
		window.addEventListener('keydown', this.onClearForm);
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.onClearForm);
	}

	handlerOnFitred = ({ target }) => {
		this.setState({
			[target.name]: target.value,
		});
	};

	handleAddContact = async newContact => {
		try {
			if (this.state.contact.edit) {
				const { id, name, number } = newContact;
				const edCont = { id, name, number };
				const editItem = await API.fetchPut(edCont);
				this.savedContact(editItem);
				this.setState({ button: 'Add contact' });
			} else {
				const newItem = await API.fetchPost(newContact);
				this.savedContact(newItem);
			}
		} catch ({ message }) {
			Notify.failure(`${message}`);
		}
	};

	handleEditContact = e => {
		const value = e.currentTarget.dataset;
		this.scrollToTop();
		this.setState({ button: 'Edit contact' });
		this.setState({
			contact: { id: value.id, name: value.name, number: value.number, edit: true },
		});
	};

	onClearForm = ({ code }) => {
		if (code === 'Escape') {
			this.setState({
				contact: { id: '', name: '', number: '', edit: false },
			});
		}
	};

	savedContact = ({ id, name, number }) => {
		if (this.state.contact.edit) {
			const newContacts = this.state.contacts.map(item => {
				if (item.id === id) {
					return { id, name, number };
				} else return item;
			});
			this.setState({ contacts: newContacts, contact: { edit: false } });
		} else {
			this.setState(prevState => {
				const newState = {
					contacts: [
						...prevState.contacts,
						{
							id,
							name,
							number,
						},
					],
				};

				return newState;
			});
		}
	};

	handleDelClick = async ({ target }) => {
		this.setState({ active: true });
		const updatedContacts = [];
		for (const contact of this.state.contacts) {
			if (contact.id === target.id) {
				try {
					await API.fetchDel(contact.id);
				} catch ({ message }) {
					Notify.failure('Removal error!');
					updatedContacts.push(contact);
				}
			} else {
				updatedContacts.push(contact);
			}
		}
		this.setState({ contacts: updatedContacts, active: false });
	};

	scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}

	render() {
		return (
			<div className='container'>
				<h1 className='title-name'>Phonebook</h1>

				<ContactForm
					onSubmitForm={this.handleAddContact}
					contacts={this.state.contacts}
					onEditValue={this.state.contact}
					buttonName={this.state.button}
				/>

				<h2 className='title-name'>Contacts</h2>

				<Filter onFiltred={this.handlerOnFitred} value={this.state.filter} />

				<ContactList
					contacts={this.state.contacts}
					filter={this.state.filter}
					onDeleteContact={this.handleDelClick}
					enable={this.state.active}
					onEdit={this.handleEditContact}
				/>
			</div>
		);
	}
}

export default App;
