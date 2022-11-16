var input = document.getElementById("screen");
var operador = ['+','-','x','/'];
var decimalAdded = false;
 
function Stack(){
	this.datastore = [];
	this.tos = 0;
	this.push = function (element) {
		this.datastore[this.tos++] = element;
	}
	this.pop = function () {
		return this.datastore[--this.tos];
	}
	this.peek = function () {
		return this.datastore[this.tos-1];
	}
	this.length = function () {
		return this.tos;
	}
}
 
function ResetButton(){
	input.value = "0";
	decimalAdded = false;
}
 
function EqualsButton(){
	var equation = input.value;
	var lastChar = equation.substring(equation.length - 1);
	equation = equation.replace(/x/g,'*');
 
	if(equation.indexOf("%") > -1){
		var res = equation.split('%');
		input.value = (res[0]/100)*res[1];
	}
	else{
		if(operador.indexOf(lastChar) > -1){
			equation = equation.substring(0, equation.length - 1);
		}
		if(equation != ''){
			if(checkParenteses(equation) == true){
				var postfix = shuntingYardAlgorithm(equation);
				var result = evaluatePostfixExpression(postfix);
				input.value = result;
			}
			else{
				input.value = "Parênteses sem correspondência";
			}
		}
		//input.value = eval(equation);
	}
 
	if(input.value.indexOf('.') > -1){
		decimalAdded = true;
	}
	else{
		decimalAdded = false;
	}
}
 
function OperadorButton(btnValue){
	var inputVal = input.value;
	var lastChar = inputVal.substring(inputVal.length - 1);
	var btnVal = btnValue;
 
	if(inputVal!='' && operador.indexOf(lastChar) == -1){
		input.value += " " + btnVal + " ";
	}
	else if(inputVal == '' && btnVal == '-'){
		input.value += " " + btnVal + " ";
	}
 
	if(operador.indexOf(lastChar) > -1 && inputVal.length > 1){
		//input.value.replace(/.$/, btnVal);
		input.value = inputVal.substring(0, inputVal.length - 1) + btnVal;
	}
 
	decimalAdded = false;
 
}
 
function DecimalButton(btnValue){
	var btnVal = btnValue;
 
	if(!decimalAdded){
		input.value += btnVal;
		decimalAdded = true;
	}
}
 
function NumeroButton(btnValue){
	if(input.value == '0')
		input.value="";
 
	var btnVal = btnValue;
	input.value += btnVal;
	//decimalAdded = false;
 
}
 
function PercentagemButton(btnValue){
	var inputVal = input.value;
	var btnVal = btnValue;
 
	if(inputVal!='' && inputVal.indexOf('-') == -1 && inputVal.indexOf('+') == -1
		&& inputVal.indexOf('/') == -1 && inputVal.indexOf('x') == -1 && inputVal.indexOf('^') == -1
		&& inputVal.indexOf('(') == -1 && inputVal.indexOf(')') == -1
		&& inputVal.indexOf('%') == -1){
		input.value += btnVal;
	}
}
 
function ParentesesButton(btnValue){
	if(input.value == '0'){
		input.value="";
	}
	var btnVal = btnValue;
 
	if(btnVal == '('){
		input.value += btnVal + " ";
	}
	else{
		input.value += " " + btnVal;
	}
	decimalAdded = false;
}
 
function checkParenteses(expression){
	var s =  new Stack();

	for(var i=0; i<expression.length; i++){
		if(expression[i] == '('){
			s.push(expression[i]);
		}
		else if(expression[i] == ')'){
			s.pop();
		}
	}

	if(s.length() == 0){
		console.log("balanced");
		return true;
	}
	else{
		console.log("unbalanced");
		return false;
	}

}

function shuntingYardAlgorithm(expression){
	var operadores = '+-/*^';
	var precedencia = {'^':4,'*':3,'/':3,'+':2,'-':2};
	var associativo = {'^':'Right','*':'Left','/':'Left','+':'Left','-':'Left'};
	var postfix="";
	var s = new Stack();
	var token;
	var operador1;
	var operador2;
 
	var res1 = expression.split(" ");

	for(var i=0; i<res1.length; i++){
		token = res1[i];

		if(operadores.indexOf(token) == -1 && token != '(' && token != ')'){
			postfix+=token + " ";
		}
		else if(operadores.indexOf(token) > -1){
			operador1 = token;
			operador2 = s.peek();
			while(operadores.indexOf(operador2) > -1 && ((associativo[operador2] == 'Left' && precedencia[operador1] <= precedencia[operador2]) ||
				(associativo[operador2] == 'Right' && precedencia[operador1] < precedencia[operador2]))){
				postfix+=operador2 + " ";
				s.pop();
				operador2 = s.peek();
			}
			s.push(operador1);
		}
		else if(token == '('){
			s.push(token);
		}
		else if(token == ')'){
			while(s.peek() != '('){
				postfix += s.pop() + " ";
			}
			s.pop();
		}
	}

	while (s.length()>0){
		postfix += s.pop() + " ";
	}

	console.log(postfix);
	return postfix;
}
 
function evaluatePostfixExpression(postfix){
	var operadores = '+-/*^';
	var s = new Stack();
	var res2 = postfix.split(" ");

	for(var j=0; j<res2.length - 1; j++){
		if(operadores.indexOf(res2[j]) == -1){
			s.push(res2[j]);
		}
		else{
			var op1 = s.pop();
			var op2 = s.pop();
			//var test = op2 + res2[j] + op1;
			var interResult = processIntermediateResult(op1, op2, res2[j]);
			s.push(interResult);
			//console.log(interResult)
		}
	}

	return s.pop();

}
 
function processIntermediateResult(operando1, operando2, operador){
	var interResult;
		switch (operador){
		case '+':
			interResult = Number(operando2) + Number(operando1);
			break;
		case '-':
			interResult = Number(operando2) - Number(operando1);
			break;
		case '*':
			interResult = Number(operando2) * Number(operando1);
			break;
		case '/':
			interResult = Number(operando2) / Number(operando1);
			break;
		case '^':
			interResult = Math.pow(Number(operando2), Number(operando1));
			break;
		default:
			console.log("Não pode ser processado");
		}

	return interResult;
}