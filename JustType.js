var JustType = function () {
	SimplEE.EventEmitter.call(this);
	this._el = document.createElement("div");
	this._el.classList.add("matbee-just-type-container");
	/*this._el.classList.add("matbee-hidden");*/
	this._el.classList.add("matbee-just-type-hint");
	this._cursorEl = document.createElement("div");
	this._cursorEl.classList.add("matbee-cursor");

	this._inputEl = document.createElement("input");
	this._inputEl.classList.add("matbee-just-type");

	this._el.appendChild(this._inputEl);
	this._el.appendChild(this._cursorEl);
	this.active = false;
	var self = this;

	this.documentKeydownBind = this.documentKeydown.bind(this);
	this.inputKeydownBind = this.inputKeydown.bind(this);
	this.inputKeyupBind = this.inputKeyup.bind(this);
	this.inputKeyPressBind = this.inputKeyPress.bind(this);
	this.inputBlurBind = this.inputBlur.bind(this);
	this.windowFocusedBind = this.windowFocused.bind(this);
	this.windowBlurredBind = this.windowBlurred.bind(this);

	$(document).on("keydown", this.documentKeydownBind);
	$(this._inputEl).on("keyup", this.inputKeyupBind);
	$(this._inputEl).on("keydown", this.inputKeydownBind);
	$(this._inputEl).on('keypress', this.inputKeyPressBind);
	$(this._inputEl).on('keypress', this.documentKeydownBind);
	$(this._inputEl).on('blur', this.inputBlurBind);
	window.onfocus = this.windowFocusedBind;
	window.onblur = this.windowBlurredBind;
	this.disable();
};
JustType.prototype = Object.create(SimplEE.EventEmitter.prototype);

JustType.prototype.windowFocused = function(ev) {
	this._el.classList.add("matbee-NF-focus");
}

JustType.prototype.windowBlurred = function(ev) {
	this._el.classList.remove("matbee-NF-focus");
}

JustType.prototype.documentKeydown = function(ev) {
	if (this.enabled) {
		if ((ev.which == 32 || ev.which == 27 || ev.which == 16 || ev.which == 9 || ev.ctrlKey || ev.altKey) && this.active == false) {
			// Don't do anything shits sheezy, yo.
		} else {
			if (this.active == true && ev.which == 27) {
				this.hide();
			} else {
				if (!this.active) {
					// Trigger it, bro.
					this.show();
				}
			}
			// Type it, bro.
		}
	}
};

JustType.prototype.inputKeydown = function(ev) {
	if (this.enabled) {
		if (ev.which == 27) {
			this.hide();
		} else if (ev.which == 13 && !$(this._inputEl).val() == "") {
			// Enter!
			this.emit("submit", $(this._inputEl).val());
			this.hide();
		} else if (ev.which == 9) {
			ev.preventDefault();
		}

		ev.stopPropagation();
	}
};

JustType.prototype.inputKeyup = function (ev) {
	if (this.enabled) {
		if ($(this._inputEl).val() == "") {
			this.hide();
		}

		ev.stopPropagation();
	}
};

JustType.prototype.inputKeyPress = function(ev) {
	if (this.enabled) {
		ev.stopPropagation();
	}	
};

JustType.prototype.inputBlur = function(ev) {
	var self = this;
	if(this.active && !this.ignoreFutureBlur) {
		this.ignoreFutureBlur = true;
		$(this._inputEl).blur();
	} else if (this.ignoreFutureBlur == true) {
		setTimeout(function () {
			$(self._inputEl).focus();
		},10);
		this.ignoreFutureBlur = false;
	}
};

JustType.prototype.toggleChatOff = function() {
	this._el.classList.add("matbee-hidden-none");
	this._el.classList.remove("matbee-in-movie-hint");
	this._el.classList.remove("matbee-just-type-hint");
	$(this._el).find('input').attr("placeholder","");
	this.active = false;
	$(this._inputEl).val("");
	$(this._inputEl).blur();
	$(document).unbind("keydown", this.documentKeydownBind);
}

JustType.prototype.toggleChatOn = function() {
	this._el.classList.remove("matbee-hidden-none");
	this._el.classList.add("matbee-in-movie-hint");
	$(this._el).find('input').attr("placeholder","");
	this.active = false;
	$(this._inputEl).blur();
	$(this._inputEl).focus();
	$(document).on("keydown", this.documentKeydownBind);
	this._el.classList.add('matbee-NF-focus');
}

JustType.prototype.show = function() {
	if (this.enabled) {
		this._el.classList.remove("matbee-in-movie-hint");
		this._el.classList.remove("matbee-just-type-hint");
		$(this._el).find('input').attr("placeholder","");				
		this.active = true;
		$(this._inputEl).blur();
		$(this._inputEl).focus();
		$(document).unbind("keydown", this.documentKeydownBind);
	}
};

JustType.prototype.hide = function () {
	this._el.classList.add("matbee-in-movie-hint");
	this._el.classList.remove("matbee-just-type-hint");
	$(this._el).find('input').attr("placeholder","");
	this.active = false;
	$(document).on("keydown", this.documentKeydownBind);
	$(this._inputEl).val("");
	$(this._inputEl).blur();
};

JustType.prototype.enable = function() {
	this.enabled = true;
	this._el.classList.remove("matbee-in-movie-hint");
	this._el.input = $(this._inputEl).attr('placeholder','Type to chat, enter to send');
};

JustType.prototype.disable = function() {
	this.enabled = false;
	this._el.classList.add("matbee-in-movie-hint");
};