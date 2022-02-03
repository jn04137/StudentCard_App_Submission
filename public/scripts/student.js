
console.log('In Student.js');

class viewHelper {

	// Retrieve an element from the DOM
	static getElement(selector) {
		const element = document.querySelector(selector)

		return element;
	}

	// Create an element with an optional CSS class
	static createElement(tag, classNames) {
		const element = document.createElement(tag)

		for (var className of classNames) {
			element.classList.add(className)
		}
		return element;
	}



	static createDataRow(label, data) {
		let row = viewHelper.createElement('div', ['form-group', 'row']);
		let labelColumn = viewHelper.createElement('label', ['col-sm-2', 'col-form-label']);
		labelColumn.textContent = label;
		let fieldColumn = viewHelper.createElement('div', ['col-sm-10']);
		let fieldText = viewHelper.createElement('label', ['form-control-plaintext']);
		fieldText.textContent = data;
		fieldColumn.append(fieldText);
		row.append(labelColumn, fieldColumn);
		return row;
	}


}


class StudentModel {
	constructor() {
		this.initialize();
	}

	initialize() {
		this.getStudentData();

	}

	getStudentData() {
		console.log('In GetStudent()');
		var xhttp = new XMLHttpRequest();

		// The code below is what we can use to do something on an
		// 'OK' status
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);


				this.students = JSON.parse(this.responseText);

				const element = document.querySelector('#root');
				let event = new CustomEvent('GetStudentData', { detail: this.students });
				element.dispatchEvent(event);

			}
		};
		xhttp.open("GET", "http://localhost:3050/api/students", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(); // <== Message body should be put in here if you want to send anything
		// xhttp.send(JSON.stringify({})); Takes the object and send a string
	}

	deleteStudent(id) {
		console.log('In DeleteStudent()');
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);

				const element = document.querySelector('#root');
				let event = new CustomEvent('StudentDeleted', { detail: 'success' });
				element.dispatchEvent(event);
				location.reload()
			}

		};

		let url = `http://localhost:3050/api/student/${id}`;

		xhttp.open("DELETE", url, true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send();
	}

	/*
	This is custom method to create a student card on frontend and backend.
	Will call /api/student/create endpoint and send student data as json
	for the backend to use.	
	*/
	createStudent() {
		console.log('In createStudent()');
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			// This code is for the deletion of student cards
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);

				const element = document.querySelector('#root');
				let event = new CustomEvent('StudentCreated', { detail: 'success' });
				element.dispatchEvent(event);
			}
			// Should probably use the getStudentData() method here after deletiong
			// to repopulate the card deck and refresh the page at the same time.

		};
		// Route to the create endpoint to create user 
		let url = `http://localhost:3050/api/student/create`;

		let nameInput = document.getElementById('createStudentNameInput').value;
		let classInput = document.getElementById('createStudentClassInput').value;
		let majorInput = document.getElementById('createStudentMajorInput').value;

		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(
			JSON.stringify({
				name: nameInput,
				class: classInput,
				major: majorInput
			})
		);
	}

}

class StudentView {
	constructor() {
		//this.createView();
	}




	// This should be where we add the add student (+)
	createView(studentData) {
		//		consol.log(studentData);
		this.studentData = studentData;

		this.app = viewHelper.getElement('#root');
		let title = this.createTitle();
		let cards = this.createCards();

		let container = viewHelper.createElement('div', ['container']);
		container.append(title, cards);

		this.app.append(container);
	}

	createTitle() {
		let title = viewHelper.createElement('div', ['title', 'h3', 'mt-4', 'mb-4']);
		title.textContent = 'Students';
		return title;
	}


	createCards() {
		console.log('Ready to Create Cards');

		let cardDeck = viewHelper.createElement('div', ['card-deck']);

		for (var student of this.studentData) {

			let card = viewHelper.createElement('div', ['card']);
			card.setAttribute('onClick', 'app.handleCardClick(' + student.id + ');');

			let cardBody = viewHelper.createElement('div', ['card-body']);
			let cardTitle = viewHelper.createElement('div', ['card-title']);
			cardTitle.textContent = student.name;
			let cardText = viewHelper.createElement('p', ['card-text']);
			cardText.textContent = student.class;

			cardBody.append(cardTitle, cardText);
			card.append(cardBody);
			cardDeck.append(card);

		}
		let plusCard = viewHelper.createElement('div', ['card']);
		let cardBody = viewHelper.createElement('div', ['card-body']);
		let cardText = viewHelper.createElement('p', ['card-text']);
		cardText.textContent = "+";
		cardBody.append(cardText);
		plusCard.append(cardBody);

		cardDeck.append(plusCard);
		plusCard.setAttribute('onClick', 'app.handleAddStudentClick();');

		return cardDeck;
	}

	createAddStudentModal() {

		let modalTitle = viewHelper.getElement('#createStudentModalLabel');
		modalTitle.textContent = "Add student";

		const modal = document.querySelector('#createStudentModal');
		$('#createStudentModal').modal('toggle');
	}

	createStudentModal(id) {

		let student = this.studentData.find(x => x.id === id);
		let modalTitle = viewHelper.getElement('#studentModalLabel');
		modalTitle.textContent = student.name;

		let classRow = this.createDataRow('Class', student.class);
		let majorRow = this.createDataRow('Major', student.major);
		let deleteRow = this.createDeleteRow(id);

		let modalBody = viewHelper.getElement('#studentModalBody');
		modalBody.replaceChildren();
		modalBody.append(classRow, majorRow, deleteRow);

		let btnFooterClose = viewHelper.createElement('button', ['btn', 'btn-primary']);
		btnFooterClose.setAttribute('type', 'button');
		btnFooterClose.setAttribute('data-dismiss', 'modal');
		btnFooterClose.textContent = 'Close';
		let modalFooter = viewHelper.getElement('#studentModalFooter');
		modalFooter.replaceChildren();
		modalFooter.append(btnFooterClose);

		const modal = document.querySelector('#studentModal');
		$('#studentModal').modal('toggle');

	}

	// This displays the student's data
	createDataRow(label, data) {
		let row = viewHelper.createElement('div', ['form-group', 'row']);
		let labelColumn = viewHelper.createElement('label', ['col-sm-2', 'col-form-label']);
		labelColumn.textContent = label;
		let fieldColumn = viewHelper.createElement('div', ['col-sm-10']);
		let fieldText = viewHelper.createElement('label', ['form-control-plaintext']);
		fieldText.textContent = data;
		fieldColumn.append(fieldText);
		row.append(labelColumn, fieldColumn);
		return row;
	}

	// This creates the delete button on each model
	createDeleteRow(id) {
		let row = viewHelper.createElement('div', ['form-group', 'row']);
		let labelColumn = viewHelper.createElement('label', ['col-sm-2', 'col-form-label']);
		labelColumn.textContent = '';
		let fieldColumn = viewHelper.createElement('div', ['col-sm-10']);

		let button = viewHelper.createElement('button', ['btn', 'btn-secondary']);
		button.textContent = 'Delete';
		button.setAttribute('onClick', 'app.handleDeleteCard(' + id + ');');


		fieldColumn.append(button);
		row.append(labelColumn, fieldColumn);
		return row;
	}


}

class StudentController {
	constructor(model, view) {
		this.model = model;
		this.view = view;


		const element = document.querySelector('#root');
		element.addEventListener('GetStudentData', function (event) {
			app.handleStudentData(event.detail);
		});
		element.addEventListener('StudentDeleted', function (event) {
			app.handleStudentDeleted(event.detail);
		});
	}

	handleStudentData(student) {
		console.log('create view');
		this.view.createView(student);
	}


	handleCardClick(id) {
		console.log('modal ' + id + ' clicked');
		this.view.createStudentModal(id);
	}

	// This will open up a modal view for add new student
	handleAddStudentClick() {
		console.log('Add student modal clicked');
		this.view.createAddStudentModal();
	}

	handleDeleteCard(id) {
		console.log('modal ' + id + ' delete');
		this.model.deleteStudent(id);
	}

	handleStudentDeleted() {
		const modal = document.querySelector('#studentModal');
		$('#studentModal').modal('toggle');
	}

	handleCancelClick() {
		console.log("Cancel button was clicked");
		document.getElementById('createStudentNameInput').value = "";
		document.getElementById('createStudentClassInput').value = "";
		document.getElementById('createStudentMajorInput').value = "";
	}

	handleSaveClick() {
		let nameInput = document.getElementById('createStudentNameInput').value;
		let classInput = document.getElementById('createStudentClassInput').value;
		let majorInput = document.getElementById('createStudentMajorInput').value;
		console.log(nameInput);
		console.log(classInput);
		console.log(majorInput);
		this.model.createStudent();
	}
}


const app = new StudentController(new StudentModel(), new StudentView());
