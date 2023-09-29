/** @format */

import { Component } from 'react';
import { Notify } from 'notiflix';
import * as API from './fetch_api';
import Filter from './filter';
import ContactList from './contactlist';
import ContactForm from './contactform';
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

	async componentDidMount() {
		try {
			const savedContacts = await API.fetchGet();
			if (savedContacts.length > 0) {
				this.setState({ contacts: savedContacts });
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

	handlerFilter = () => {
		return this.state.contacts.filter(contact => {
			const searchName = contact.name.toLowerCase();
			const filterName = this.state.filter.toLowerCase();
			return searchName.includes(filterName);
		});
	};

	addContact = async newContact => {
		try {
			if (this.state.contact.edit) {
				const { id, name, number } = newContact;
				const edCont = { id, name, number };
				const editItem = await API.fetchPut(edCont);
				this.savedContact(editItem);
				this.setState({ button: 'Add contact' });
				this.setState({ active: false });
			} else {
				const newItem = await API.fetchPost(newContact);
				this.savedContact(newItem);
			}
		} catch ({ message }) {
			Notify.failure(`${message}`);
		}
	};

	handleAddContact = newContact => {
		const checkName = this.state.contacts.find(
			contact => contact.name.toLowerCase() === newContact.name.toLowerCase()
		);
		if (checkName && !this.state.contact.edit) {
			alert(`${checkName.name} is already in contacts.`);
			return newContact;
		}
		this.addContact(newContact);
		this.setState({ active: false });
		return { name: '', number: '' };
	};

	handleEditContact = e => {
		if (e.target.classList.contains('del-button')) {
			return;
		}
		const value = e.currentTarget.dataset;
		this.scrollToTop();
		this.setState({ active: true });
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
				return {
					contacts: [
						...prevState.contacts,
						{
							id,
							name,
							number,
						},
					],
				};
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
					onEditValue={this.state.contact}
					buttonName={this.state.button}
				/>

				<h2 className='title-name'>Contacts</h2>

				<Filter onFiltred={this.handlerOnFitred} value={this.state.filter} />

				<ContactList
					contacts={this.handlerFilter()}
					onDeleteContact={this.handleDelClick}
					enable={this.state.active}
					onEdit={this.handleEditContact}
				/>
			</div>
		);
	}
}

export default App;
