var initializeNotesWindow;

YUI().use('node', function (Y) {
	var options = (function () {
		var node = Y.one('#options');
		node.hide();
		var hidden = true;

		function toggle() {
			hidden = !hidden;
			if (hidden) {
				node.hide();
			} else {
				node.show();
			}
		}

		return {
			toggle: toggle 
		};
	})();

	var presentation = (function () {
		var pages = Y.all('.page');
		var firstPage = 0;
		var lastPage = pages.size() - 1;
		var currentPage = firstPage;
		var slides = Y.all('.page .slide');
		var notes = Y.all('.page .notes');

		showSlides();
		gotoPage(firstPage);

		function showSlides() {
			notes.hide();
			slides.show();
		}

		function showNotes() {
			slides.hide();
			notes.show();
		}

		function gotoPage(pageNumber) {
			currentPage = pageNumber;
			pages.hide();
			pages.item(pageNumber).show();
		}

		function gotoNextPage() {
			if (currentPage < lastPage) {
				gotoPage(currentPage + 1);
			}
		}

		function gotoPreviousPage() {
			if (currentPage > firstPage) {
				gotoPage(currentPage - 1);
			}
		}

		function getCurrentPage() {
			return currentPage;
		}

		return {
			getCurrentPage: getCurrentPage,
			showSlides: showSlides,
			showNotes: showNotes,
			gotoPage: gotoPage,
			gotoNextPage: gotoNextPage,
			gotoPreviousPage: gotoPreviousPage
		};
	})();

	initializeNotesWindow = function (slidesWindowPresentation) {
		presentation.showNotes();
		presentation.gotoPage(slidesWindowPresentation.getCurrentPage());
		slidesPresentation = slidesWindowPresentation;
		notesPresentation = presentation;
		return notesPresentation;
	};

	var slidesPresentation = presentation;
	var notesPresentation;

	function openNotesWindow() {
		var notesWindow = window.open(window.location);
		notesWindow.onload = function () {
			notesPresentation =
				notesWindow.initializeNotesWindow(slidesPresentation);
		}
	}

	Y.all('#options').on('click', function () {
		options.toggle();
	});

	Y.one('#options #open-notes').on('click', openNotesWindow);

	Y.on('keypress', function (e) {
		switch (e.keyCode) {
			case 32: // space
				slidesPresentation.gotoNextPage();
				notesPresentation && notesPresentation.gotoNextPage();
				break;
			case 112: // p
				slidesPresentation.gotoPreviousPage();
				notesPresentation && notesPresentation.gotoPreviousPage();
				break;
			case 79: // O
				options.toggle();
				break;
		}
	});
});
