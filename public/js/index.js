var socket = io();

var IntInput = React.createClass({displayName: "IntInput",
		handleTextChange: function(){
				var x = this.refs.intField.getDOMNode().value;
				
				if(x != ''){
						this.refs.intField.getDOMNode().className = 'active';
				} else {
						this.refs.intField.getDOMNode().className = '';
				}

				this.props.onUserInput(x);

				IntInput.data = x;

		},

		render: function(){
			return (
						React.createElement("div", {className: "control"}, 
						React.createElement("input", {type: "text", id: "int", ref: "intField", placeholder: "How fast should I go?", autoFocus: true, required: true, autocomplete:"off", onChange: this.handleTextChange}), 
						React.createElement("label", {for: "int"}, "Speed")
					)
			)
		}
});

var DurInput = React.createClass({displayName: "DurInput",
		handleTextChange: function(){
				var x = this.refs.durField.getDOMNode().value;
				
				if(x != ''){
						this.refs.durField.getDOMNode().className = 'active';
				} else {
						this.refs.durField.getDOMNode().className = '';
				}

				this.props.onUserInput(x);

				DurInput.data = x;
				
		},

		render: function(){
			return (
						React.createElement("div", {className: "control"}, 
						React.createElement("input", {type: "text", id: "dur", ref: "durField", placeholder: "How long should I move?", autoFocus: true, required: true, autocomplete:"off", onChange: this.handleTextChange}), 
						React.createElement("label", {for: "dur"}, "Duration")
					)
			)
		}
});


var DirInput = React.createClass({displayName: "DirInput",
		handleTextChange: function(){
				var x = this.refs.dirField.getDOMNode().value;
				
				if(x != ''){
						this.refs.dirField.getDOMNode().className = 'active';
				} else {
						this.refs.dirField.getDOMNode().className = '';
				}

				this.props.onUserInput(x);

				DirInput.data = x;
		},

		render: function(){
			return (
						React.createElement("div", {className: "control"}, 
						React.createElement("input", {type: "text", id: "dir", ref: "dirField", placeholder: "Which way should I move?", autoFocus: true, required: true, autocomplete:"off", onChange: this.handleTextChange}), 
						React.createElement("label", {for: "dir"}, "Direction")
					)
			)
		}
});


var NewSpeedForm = React.createClass({displayName: "NewSpeedForm",

		getInitialState: function() {
				return {
						intText: '',
						durText: '',
						dirText: ''
				};
		},
		handleUserInput: function(intText, durText, dirText) {
				this.setState({
						intText: intText,
						durText: durText,
						dirText: dirText
				});

		},
		onItemClick : function (event) {

		    console.log('submit');

		    var integer   = IntInput.data;
		    var duration  = DurInput.data;
		    var direction = DirInput.data;

		    //if (int.length > 0 && dur.length > 0 && dir.length > 0) {
		    socket.emit ('new speed', {int: integer, dur: duration, dir: direction})
		    //} else {
		    	//console.log('* please enter an amount *')
		    //}

		    

		},
		onItemFly : function (event) {

		    socket.emit('fly')
		  
		},
	render: function(){
		return (
				 React.createElement("form", {}, 
				
						React.createElement("fieldset", null, 
								React.createElement("legend", null, "New Instructions"), 
								
								React.createElement(IntInput, {onUserInput: this.handleUserInput}), 
								React.createElement(DurInput, {onUserInput: this.handleUserInput}), 
								React.createElement(DirInput, {onUserInput: this.handleUserInput}), 
								
								React.createElement("input", {type: "submit", value: "send", onClick: this.onItemClick }),
								React.createElement("br"),
								React.createElement("input", {type: "submit", value: "fly", onClick: this.onItemFly })
						)

				)
				);
	}
});

React.render(React.createElement(NewSpeedForm, null), document.getElementById('stage'));




