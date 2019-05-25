/**
 * Main program scope
 *
 * @type {Object}
 */
var tofma = {};

/**
 * Check if the variable is a number
 *
 * @param {*} x - Variable to check
 * @return {boolean}
 */
tofma.isNumber = function(x)
{
	return ((typeof x) === "number") && !isNaN(x);
};

/**
 * Check if the variable is not a number
 *
 * @param {*} x - Variable to check
 * @return {boolean}
 */
tofma.isNotNumber = function(x)
{
	return ((typeof x) !== "number") || isNaN(x);
};

/**
 * Error message log for the 'tofma.isNotNumber' function
 *
 * @param {string} functionName - The name of the function in which the error occurred
 * @param {string} variableName - The name of the variable through which the error occurred
 * @param {*} variable - The contents of the variable through which the error occurred
 */
tofma.isNotNumberErrLog = function(functionName, variableName, variable)
{
	console.error(functionName + " Bad data type for '" + variableName + "'",
		"\n\ttypeof(" + variableName + "):", typeof variable,
		"\n\tisNaN(" + variableName + "):",  isNaN(variable),
		"\n\tExpected type: number"
	);
};

/**
 * Check if the variable is an integer
 *
 * @param {*} x - Variable to check
 * @return {boolean}
 */
tofma.isInteger = function(x) {
	return typeof x === 'number' &&
		isFinite(x) &&
		Math.floor(x) === x;
};

/**
 * Lagrange's Interpolation Nodes Type
 *
 * The 'x' and 'y' arrays must be of the same length
 *
 * @typedef {Object} T_LagrangeInterpolationNodes
 * @property {number[]} x - Array of arguments of the interpolated function
 * @property {number[]} y - Array of values of the interpolated function
 */

/**
 * Interpolate the value using the Lagrange polynomials
 *
 * @param {number} x - Value for interpolation
 * @param {T_LagrangeInterpolationNodes} nodes - A set of at least two nodes for interpolation
 * @return {string|number} - Interpolated value or "undefined" when an error occurs
 */
tofma.lagrangeInterpolation = function(x, nodes)
{
	try {
		/* discard the wrong data types for 'nodes' */
		if(!nodes) throw 1;
		/* check if 'nodes' contains the required tables */
		if(!Array.isArray(nodes.x) || !Array.isArray(nodes.y)) throw 2;
		/* a minimum of two nodes must be specified for interpolation */
		if((nodes.x.length < 2) || (nodes.y.length < 2)) throw 3;
		/* value tables must be the same dimension */
		if(nodes.x.length !== nodes.y.length) throw 4;
		/* 'x' type must be a number */
		if(tofma.isNotNumber(x)) throw 5;
		/* each element of the array must be a number */
		for(var _i=0; _i<nodes.x.length ;_i++)
		{
			if(tofma.isNotNumber(nodes.x[_i])) throw 6;
			if(tofma.isNotNumber(nodes.y[_i])) throw 6;
		}

		var result = 0; /* default: neutral element for adding */
		var tmp = 1; /* default: neutral element for multiplication */

		for(var j=0; j<nodes.x.length ;j++)
		{
			tmp = 1;

			for(var i=0; i<nodes.x.length ;i++)
			{
				if(i === j) continue;
				tmp *= (x - nodes.x[i]) / (nodes.x[j] - nodes.x[i]);
			}

			result += nodes.y[j] * tmp;
		}

		return result;
	} catch(error) {
		/* for a better look in the console */
		var errorFunctionName = "tofma.lagrangeInterpolation:";

		/* handle the right exception */
		switch(error)
		{
			case 1:
				console.error(errorFunctionName, "Bad data type for 'nodes'",
					"\n\ttypeof(nodes):", typeof nodes
				);
				break;
			case 2:
				console.error(errorFunctionName, "'nodes.x' or 'nodes.y' does not contain an array",
					"\n\ttypeof(nodes):",   typeof nodes,
					"\n\ttypeof(nodes.x):", typeof nodes.x,
					"\n\ttypeof(nodes.y):", typeof nodes.y
				);
				break;
			case 3:
				console.error(errorFunctionName, "A minimum of two nodes must be specified for interpolation",
					"\n\tnodes.x.length:", nodes.x.length,
					"\n\tnodes.y.length:", nodes.y.length
				);
				break;
			case 4:
				console.error(errorFunctionName, "Value tables are not the same dimension",
					"\n\tnodes.x.length:", nodes.x.length,
					"\n\tnodes.y.length:", nodes.y.length
				);
				break;
			case 5:
				tofma.isNotNumberErrLog(errorFunctionName, "x", x);
				break;
			case 6:
				console.error(errorFunctionName, "At least one element from the 'nodes.x' or 'nodes.y' array is not" +
					" a number");
				break;
			default:
				console.error(errorFunctionName, error);
		}

		/* no valid value */
		return "undefined";
	}
};

/**
 * Sellmeier's Coefficients Type
 *
 * @typedef {Object} T_SellmeierCoefficients
 * @property {number[]} a - Three coefficients
 * @property {number[]} b - Three coefficients
 */

/** @type {Object} */
tofma.sellmeierCoefficients = {};

/**
 * Calculate Sellmeier's coefficients for germanium admixture
 *
 * @param {number} concentration - Molecular concentration of germanium admixture in the optical fiber core [M%]
 * @return {string|T_SellmeierCoefficients} coefficients - Calculated coefficients or "undefined" when an error occurs
 */
tofma.sellmeierCoefficients.germanium = function(concentration)
{
	try {
		/* 'concentration' type must be a number */
		if(tofma.isNotNumber(concentration)) throw 1;
		/* for the nodes listed below, the concentration interpolation is true between [0 and 15] [M%] */
		if((concentration < 0) || (concentration > 15)) throw 2;

		var x_values = [0, 3.1, 5.8, 7.9, 13.5];

		function a1(x) {
			var y_values = [
				0.6961663,
				0.7028554,
				0.7088876,
				0.7136824,
				0.711040
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function a2(x) {
			var y_values = [
				0.4079426,
				0.4146307,
				0.4206803,
				0.4254807,
				0.451885
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function a3(x) {
			var y_values = [
				0.8974994,
				0.8974540,
				0.8956551,
				0.8964226,
				0.704048
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b1(x) {
			var y_values = [
				0.0684043,
				0.0727723,
				0.0609053,
				0.0617167,
				0.064270
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b2(x) {
			var y_values = [
				0.1162414,
				0.1143085,
				0.1254514,
				0.1270814,
				0.129408
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b3(x) {
			var y_values = [
				9.8961610,
				9.8961610,
				9.8961620,
				9.8961610,
				9.425478
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		return {
			a: [a1(concentration), a2(concentration), a3(concentration)],
			b: [b1(concentration), b2(concentration), b3(concentration)]
		};
	} catch(error) {
		/* for a better look in the console */
		var errorFunctionName = "tofma.sellmeierCoefficients.germanium:";

		/* handle the right exception */
		switch(error)
		{
			case 1:
				tofma.isNotNumberErrLog(errorFunctionName, "concentration", concentration);
				break;
			case 2:
				console.error(errorFunctionName, "The acceptable range for the concentration has been exceeded." +
					" The expected value is between 0 and 15.",
					"\n\tconcentration:", concentration
				);
				break;
			default:
				console.error(errorFunctionName, error);
		}

		/* no valid value */
		return "undefined";
	}
};

/**
 * Calculate Sellmeier's coefficients for fluoride admixture
 *
 * @param {number} concentration - Molecular concentration of fluoride admixture in the optical fiber cladding [M%]
 * @return {string|T_SellmeierCoefficients} coefficients - Calculated coefficients or "undefined" when an error occurs
 */
tofma.sellmeierCoefficients.fluorine = function(concentration)
{
	try {
		/* 'concentration' type must be a number */
		if(tofma.isNotNumber(concentration)) throw 1;
		/* for the nodes listed below, the concentration interpolation is true between [0 and 2] [M%] */
		if((concentration < 0) || (concentration > 2)) throw 2;

		var x_values = [0, 1, 2];

		function a1(x) {
			var y_values = [
				0.6961663,
				0.69325,
				0.67744
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function a2(x) {
			var y_values = [
				0.4079426,
				0.39720,
				0.40101
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function a3(x) {
			var y_values = [
				0.8974994,
				0.86008,
				0.87193
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b1(x) {
			var y_values = [
				0.0684043,
				0.06724,
				0.06135
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b2(x) {
			var y_values = [
				0.1162414,
				0.11714,
				0.12030
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b3(x) {
			var y_values = [
				9.8961610,
				9.77610,
				9.85630
			];

			return tofma.lagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		return {
			a: [a1(concentration), a2(concentration), a3(concentration)],
			b: [b1(concentration), b2(concentration), b3(concentration)]
		};
	} catch(error) {
		/* for a better look in the console */
		var errorFunctionName = "tofma.sellmeierCoefficients.fluorine:";

		/* handle the right exception */
		switch(error)
		{
			case 1:
				tofma.isNotNumberErrLog(errorFunctionName, "concentration", concentration);
				break;
			case 2:
				console.error(errorFunctionName, "The acceptable range for the concentration has been exceeded." +
					" The expected value is between 0 and 2.",
					"\n\tconcentration:", concentration
				);
				break;
			default:
				console.error(errorFunctionName, error);
		}

		/* no valid value */
		return "undefined";
	}
};

/**
 * Calculate the Sellmeier equation
 *
 * @param {number} wavelength - The wavelength [um]
 * @param {T_SellmeierCoefficients} coefficients - Calculated coefficients
 * @return {string|number} refractiveIndex - Refractive index squared (n^2) or "undefined" when an error occurs
 */
tofma.sellmeier = function(wavelength, coefficients)
{
	try {
		/* 'wavelength' type must be a number */
		if(tofma.isNotNumber(wavelength)) throw 1;
		/* the wavelength must be 0 or be positive */
		if(wavelength < 0) throw 2;
		/* discard the wrong data types for 'coefficients' */
		if(!coefficients) throw 3;
		/* check if 'coefficients' contains the required tables */
		if(!Array.isArray(coefficients.a) || !Array.isArray(coefficients.b)) throw 4;
		/* length of arrays coefficients.a and coefficients.b must be 3 */
		if((coefficients.a.length !== 3) || (coefficients.b.length !== 3)) throw 5;

		var i; /* for iterator */
		var refractiveIndex = 1;

		/* prepare values */
		wavelength *= wavelength;
		for(i=0; i<=2; i++) coefficients.b[i] *= coefficients.b[i];

		for(i=0; i<=2; i++) refractiveIndex += (coefficients.a[i] * wavelength) / (wavelength - coefficients.b[i]);

		return refractiveIndex;
	} catch(error) {
		/* for a better look in the console */
		var errorFunctionName = "tofma.sellmeier:";

		/* handle the right exception */
		switch(error)
		{
			case 1:
				tofma.isNotNumberErrLog(errorFunctionName, "wavelength", wavelength);
				break;
			case 2:
				console.log(errorFunctionName, "The wavelength can not be negative",
					"\n\twavelength:", wavelength
				);
				break;
			case 3:
				console.error(errorFunctionName, "Bad data type for 'coefficients'",
					"\n\ttypeof(coefficients):", typeof coefficients
				);
				break;
			case 4:
				console.error(errorFunctionName, "'coefficients.a' or 'coefficients.b' does not contain an array",
					"\n\ttypeof(coefficients):",   typeof coefficients,
					"\n\ttypeof(coefficients.a):", typeof coefficients.a,
					"\n\ttypeof(coefficients.b):", typeof coefficients.b
				);
				break;
			case 5:
				console.error(errorFunctionName, "length of array coefficients.a or coefficients.b is not 3",
					"\n\tcoefficients.a.length:", coefficients.a.length,
					"\n\tcoefficients.b.length:", coefficients.b.length
				);
				break;
			default:
				console.error(errorFunctionName, error);
		}

		/* no valid value */
		return "undefined";
	}
};

/**
 * An object containing data to calculate the profile
 *
 * @typedef {Object} T_ProfileData
 * @property {number} shape - Selection of profile shape
 * <br> `1` - Triangular profile
 * <br> `2` - Gradient profile
 * <br> `3` - Step profile
 * <br> `4` - Step profile with a depressive cladding
 * <br> `5` - Step profile with a depressive ring
 * @property {number} n1 - Squared refractive index 'n1'
 * @property {number} n2 - Squared refractive index 'n2'
 * @property {number} n3 - Squared refractive index 'n3'
 * @property {number} a - greater than zero value determining range of the 'n1' refractive index
 * @property {number} b - Non-negative value determining range of the 'n2' or 'n3' refractive index
 * @property {number} c - Non-negative value determining range of the 'n3' refractive index
 * @property {number} q - Power which determine smoothness of the gradient profile. q: (1 ; Infinity)
 */

/**
 * Calculate the refractive index profile of the optical fiber.
 * This function is not protected against errors. It has to be fast.
 *
 * @param {T_ProfileData} data - An object containing arguments for calculations
 * @param {number} x - Distance from the center of the core. x: <0 ; Infinity)
 * @return {number} result - The refractive index for a specific 'x'
 */
tofma.profile = function(data, x)
{
	var result = null;

	switch(data.shape)
	{
		case 1: /* triangular profile */
			/* n1 -> n2 */
			if((x >= 0) && (x < data.a)) result = data.n1 + (data.n2 - data.n1) * (x / data.a);
			if(x >= data.a) result = data.n2;
			break;

		case 2: /* gradient profile */
			/* n1 -> n2 */
			if((x >= 0) && (x < data.a)) result = data.n1 + (data.n2 - data.n1) * Math.pow(x / data.a, data.q);
			if(x >= data.a) result = data.n2;
			break;

		case 3: /* step profile */
			/* n1 -> n2 */
			if((x >= 0) && (x < data.a)) result = data.n1;
			if(x >= data.a) result = data.n2;
			break;

		case 4: /* step profile with a depressive cladding */
			/* n1 -> n3 -> n2 */
			if((x >= 0) && (x < data.a)) result = data.n1;
			if((x >= data.a) && (x < (data.a + data.b))) result = data.n3;
			if(x >= (data.a + data.b)) result = data.n2;
			break;

		case 5: /* step profile with a depressive ring */
			/* n1 -> n2 -> n3 -> n2 */
			if((x >= 0) && (x < data.a)) result = data.n1;
			if((x >= data.a) && (x < (data.a + data.b))) result = data.n2;
			if((x >= (data.a + data.b)) && (x < (data.a + data.b + data.c))) result = data.n3;
			if(x >= (data.a + data.b + data.c)) result = data.n2;
			break;
	}

	return Math.sqrt(result);
};

/**
 * Calculate the cut-off wavelength
 *
 * @param {T_ProfileData} data - An object containing arguments for calculations
 * @return {string|number} - The cut-off wavelength or "undefined" when an error occurs
 */
tofma.cutoffWavelength = function(data)
{
	try {
		/* discard the wrong data types for 'data' */
		if(!data) throw 1;
		/* 'data.shape' type must be a number */
		if(tofma.isNotNumber(data.shape)) throw 2;
		/* 'data.shape' must be {1, 2, 3, 4, 5} */
		if((data.shape < 1) || (data.shape > 5) || !tofma.isInteger(data.shape)) throw 3;
		/* 'data.n1' type must be a number */
		if(tofma.isNotNumber(data.n1)) throw 4;
		/* 'data.n2' type must be a number */
		if(tofma.isNotNumber(data.n2)) throw 5;
		/* 'data.a' type must be a number */
		if(tofma.isNotNumber(data.a)) throw 6;
		/* 'data.a' must be greater than 0 */
		if(data.a <= 0) throw 7;

		var NA = Math.sqrt(data.n1) * Math.sqrt((data.n1 - data.n2) / data.n1);
		var Vc = 2.405; /* step+ profile */

		if(data.shape === 1) { /* triangular profile */
			Vc *= Math.sqrt(3);
		} else if(data.shape === 2) { /* gradient profile */
			/* 'data.q' type must be a number */
			if(tofma.isNotNumber(data.q)) throw 8;
			/* 'data.q' must be greater than 1 */
			if(data.q <= 1) throw 9;

			Vc *= Math.sqrt((data.q + 2) / data.q);
		}

		return NA * ((2 * Math.PI * data.a) / Vc);
	} catch(error) {
		/* for a better look in the console */
		var errorFunctionName = "tofma.cutoffWavelength:";

		/* handle the right exception */
		switch(error)
		{
			case 1:
				console.error(errorFunctionName, "Bad data type for 'data'",
					"\n\ttypeof(data):", typeof data
				);
				break;
			case 2:
				tofma.isNotNumberErrLog(errorFunctionName, "data.shape", data.shape);
				break;
			case 3:
				console.error(errorFunctionName, "'data.shape' is not one of {1, 2, 3, 4, 5}",
					"\n\tdata.shape: ", data.shape
				);
				break;
			case 4:
				tofma.isNotNumberErrLog(errorFunctionName, "data.n1", data.n1);
				break;
			case 5:
				tofma.isNotNumberErrLog(errorFunctionName, "data.n2", data.n2);
				break;
			case 6:
				tofma.isNotNumberErrLog(errorFunctionName, "data.a", data.a);
				break;
			case 7:
				console.error(errorFunctionName, "'data.a' is not greater 0",
					"\n\tdata.a: ", data.a
				);
				break;
			case 8:
				tofma.isNotNumberErrLog(errorFunctionName, "data.q", data.q);
				break;
			case 9:
				console.error(errorFunctionName, "'data.q' is not greater than 1",
					"\n\tdata.q: ", data.q
				);
				break;
			default:
				console.error(errorFunctionName, error);
		}

		/* no valid value */
		return "undefined";
	}
};

/**
 * Calculate the Verdet Constant
 *
 * @param {number} wavelength - The wavelength [um]
 * @param {T_SellmeierCoefficients} coefficients - Calculated coefficients
 * @return {string|number} - Verdet constant or "undefined" when an error occurs
 */
tofma.verdetConstant = function(wavelength, coefficients)
{
	try {
		/* 'wavelength' type must be a number */
		if(tofma.isNotNumber(wavelength)) throw 1;
		/* the wavelength must be 0 or be positive */
		if(wavelength < 0) throw 2;
		/* discard the wrong data types for 'coefficients' */
		if(!coefficients) throw 3;
		/* check if 'coefficients' contains the required tables */
		if(!Array.isArray(coefficients.a) || !Array.isArray(coefficients.b)) throw 4;
		/* length of arrays coefficients.a and coefficients.b must be 3 */
		if((coefficients.a.length !== 3) || (coefficients.b.length !== 3)) throw 5;

		var i; /* for iterator */

		/* prepare values */
		var wavelenPow2 = wavelength * wavelength;
		for(i=0; i<=2; i++) coefficients.b[i] *= coefficients.b[i];

		/* derivative TOP TOP TOP TOP */
		var top = 0;
		for(i=0; i<=2; i++) {
			top +=
				(coefficients.a[i] * coefficients.b[i] * wavelength)
				/
				Math.pow(wavelenPow2 - coefficients.b[i], 2);
		}

		/* derivative BOTTOM BOTTOM BOTTOM BOTTOM */
		var bottom = 1;
		for(i=0; i<=2; i++) {
			bottom +=
				(coefficients.a[i] * wavelenPow2)
				/
				(wavelenPow2 - coefficients.b[i]);
		}
		bottom = Math.sqrt(bottom);

		return 293.3396048946175 * wavelength * Math.abs(top / bottom);
	} catch(error) {
		/* for a better look in the console */
		var errorFunctionName = "tofma.verdetConstant:";

		/* handle the right exception */
		switch(error)
		{
			case 1:
				tofma.isNotNumberErrLog(errorFunctionName, "wavelength", wavelength);
				break;
			case 2:
				console.log(errorFunctionName, "The wavelength can not be negative",
					"\n\twavelength:", wavelength
				);
				break;
			case 3:
				console.error(errorFunctionName, "Bad data type for 'coefficients'",
					"\n\ttypeof(coefficients):", typeof coefficients
				);
				break;
			case 4:
				console.error(errorFunctionName, "'coefficients.a' or 'coefficients.b' does not contain an array",
					"\n\ttypeof(coefficients):",   typeof coefficients,
					"\n\ttypeof(coefficients.a):", typeof coefficients.a,
					"\n\ttypeof(coefficients.b):", typeof coefficients.b
				);
				break;
			case 5:
				console.error(errorFunctionName, "length of array coefficients.a or coefficients.b is not 3",
					"\n\tcoefficients.a.length:", coefficients.a.length,
					"\n\tcoefficients.b.length:", coefficients.b.length
				);
				break;
			default:
				console.error(errorFunctionName, error);
		}

		/* no valid value */
		return "undefined";
	}
};

/* structure definition for modeler DOM */
tofma.dom = {};
	/* inputs */
	tofma.dom.input = {};
	tofma.dom.input.urlArguments = {};
	tofma.dom.input.profiles = {};
	tofma.dom.input.arguments = {};
	tofma.dom.input.submits = {};
	/* outputs */
	tofma.dom.output = {};
	tofma.dom.output.error = {};
	tofma.dom.output.values = {};
	tofma.dom.output.plots = {};
/* END - structure definition for modeler DOM - END */

/**
 * Get modeler DOM and create 'tofma.dom'
 *
 * @return {null|boolean} - return 'true' or 'null' when an error occurs
 */
tofma.getModelerDOM = function() {
	/* search for DOM elements */
	tofma.dom.input.urlArguments.block = document.getElementById("modelerInputURLArguments");
	tofma.dom.input.urlArguments.cancel = document.getElementById("modelerInputURLArgumentsCancel");
	tofma.dom.input.urlArguments.load = document.getElementById("modelerInputURLArgumentsLoad");

	tofma.dom.input.profiles.p1 = document.getElementById("modelerInputProfile1");
	tofma.dom.input.profiles.p2 = document.getElementById("modelerInputProfile2");
	tofma.dom.input.profiles.p3 = document.getElementById("modelerInputProfile3");
	tofma.dom.input.profiles.p4 = document.getElementById("modelerInputProfile4");
	tofma.dom.input.profiles.p5 = document.getElementById("modelerInputProfile5");

	tofma.dom.input.arguments.germanium = document.getElementById("modelerInputGermanium");
	tofma.dom.input.arguments.fluoride = document.getElementById("modelerInputFluoride");
	tofma.dom.input.arguments.wavelength = document.getElementById("modelerInputWavelength");
	tofma.dom.input.arguments.a = document.getElementById("modelerInputA");
	tofma.dom.input.arguments.b = document.getElementById("modelerInputB");
	tofma.dom.input.arguments.c = document.getElementById("modelerInputC");
	tofma.dom.input.arguments.q = document.getElementById("modelerInputQ");
	tofma.dom.input.arguments.points2D = document.getElementById("modelerInputPoints2D");
	tofma.dom.input.arguments.points3D = document.getElementById("modelerInputPoints3D");

	tofma.dom.input.submits.plot2D = document.getElementById("modelerInputPlot2D");
	tofma.dom.input.submits.plot3D = document.getElementById("modelerInputPlot3D");
	tofma.dom.input.submits.generate = document.getElementById("modelerInputGenerate");

	tofma.dom.output.error.block = document.getElementById("modelerOutputError");
	tofma.dom.output.error.text = document.getElementById("modelerOutputErrorText");

	tofma.dom.output.values.block = document.getElementById("modelerOutputValues");
	tofma.dom.output.values.n1 = document.getElementById("modelerOutputValuesN1");
	tofma.dom.output.values.n2 = document.getElementById("modelerOutputValuesN2");
	tofma.dom.output.values.n3 = document.getElementById("modelerOutputValuesN3");
	tofma.dom.output.values.n3Block = document.getElementById("modelerOutputValuesN3Block");
	tofma.dom.output.values.v1 = document.getElementById("modelerOutputValuesV1");
	tofma.dom.output.values.v2 = document.getElementById("modelerOutputValuesV2");
	tofma.dom.output.values.v3 = document.getElementById("modelerOutputValuesV3");
	tofma.dom.output.values.v3Block = document.getElementById("modelerOutputValuesV3Block");

	tofma.dom.output.plots.plot2D = document.getElementById("modelerOutputPlot2D");
	tofma.dom.output.plots.plot3D = document.getElementById("modelerOutputPlot3D");

	/* tests for null in 'tofma.dom' */
	try {
		if(!tofma.dom.input.urlArguments.block) throw "tofma.dom.input.urlArguments.block";
		if(!tofma.dom.input.urlArguments.cancel) throw "tofma.dom.input.urlArguments.cancel";
		if(!tofma.dom.input.urlArguments.load) throw "tofma.dom.input.urlArguments.load";

		if(!tofma.dom.input.profiles.p1) throw "tofma.dom.input.profiles.p1";
		if(!tofma.dom.input.profiles.p2) throw "tofma.dom.input.profiles.p2";
		if(!tofma.dom.input.profiles.p3) throw "tofma.dom.input.profiles.p3";
		if(!tofma.dom.input.profiles.p4) throw "tofma.dom.input.profiles.p4";
		if(!tofma.dom.input.profiles.p5) throw "tofma.dom.input.profiles.p5";

		if(!tofma.dom.input.arguments.germanium) throw "tofma.dom.input.arguments.germanium";
		if(!tofma.dom.input.arguments.fluoride) throw "tofma.dom.input.arguments.fluoride";
		if(!tofma.dom.input.arguments.wavelength) throw "tofma.dom.input.arguments.wavelength";
		if(!tofma.dom.input.arguments.a) throw "tofma.dom.input.arguments.a";
		if(!tofma.dom.input.arguments.b) throw "tofma.dom.input.arguments.b";
		if(!tofma.dom.input.arguments.c) throw "tofma.dom.input.arguments.c";
		if(!tofma.dom.input.arguments.q) throw "tofma.dom.input.arguments.q";
		if(!tofma.dom.input.arguments.points2D) throw "tofma.dom.input.arguments.points2D";
		if(!tofma.dom.input.arguments.points3D) throw "tofma.dom.input.arguments.points3D";

		if(!tofma.dom.input.submits.plot2D) throw "tofma.dom.input.submits.plot2D";
		if(!tofma.dom.input.submits.plot3D) throw "tofma.dom.input.submits.plot3D";
		if(!tofma.dom.input.submits.generate) throw "tofma.dom.input.submits.generate";

		if(!tofma.dom.output.error.block) throw "tofma.dom.output.error.block";
		if(!tofma.dom.output.error.text) throw "tofma.dom.output.error.text";

		if(!tofma.dom.output.values.block) throw "tofma.dom.output.values.block";
		if(!tofma.dom.output.values.n1) throw "tofma.dom.output.values.n1";
		if(!tofma.dom.output.values.n2) throw "tofma.dom.output.values.n2";
		if(!tofma.dom.output.values.n3) throw "tofma.dom.output.values.n3";
		if(!tofma.dom.output.values.n3Block) throw "tofma.dom.output.values.n3Block";
		if(!tofma.dom.output.values.v1) throw "tofma.dom.output.values.v1";
		if(!tofma.dom.output.values.v2) throw "tofma.dom.output.values.v2";
		if(!tofma.dom.output.values.v3) throw "tofma.dom.output.values.v3";
		if(!tofma.dom.output.values.v3Block) throw "tofma.dom.output.values.v3Block";

		if(!tofma.dom.output.plots.plot2D) throw "tofma.dom.output.plots.plot2D";
		if(!tofma.dom.output.plots.plot3D) throw "tofma.dom.output.plots.plot3D";

		return true;
	} catch(error) {
		/* for programmer */
		console.error("tofma.getModelerDOM: The required DOM element was not found!\n\t" +
			error + " is null!\n\tThe program stopped!");

		/* for user */
		alert("ERROR: The required DOM element was not found!");
		alert(error + " is null!");
		alert("The program stopped!");

		return null;
	}
};

/* structure definition for global I/O */
tofma.input = {};
	tofma.input.profile = {};
	tofma.input.germanium = {};
	tofma.input.fluoride = {};
	tofma.input.wavelength = {};
	tofma.input.a = {};
	tofma.input.b = {};
	tofma.input.c = {};
	tofma.input.q = {};
	tofma.input.points2D = {};
	tofma.input.points3D = {};
	tofma.input.plot2D = {};
	tofma.input.plot3D = {};

tofma.output = {};
	tofma.output.n1 = {};
	tofma.output.n2 = {};
	tofma.output.n3 = {};
	tofma.output.v1 = {};
	tofma.output.v2 = {};
	tofma.output.v3 = {};
/* END - structure definition for global I/O - END */

tofma.input.urlArgsShow = function(show) {

};

tofma.output.errorShow = function(show) {

};

tofma.output.errorPrint = function(text) {

};

tofma.output.n3Show = function(show) {

};

tofma.output.v3Show = function(show) {

};

tofma.input.profile.set = function(value) {

};

tofma.input.profile.get = function() {

};

tofma.input.germanium.set = function(value) {

};

tofma.input.germanium.get = function() {

};

tofma.input.fluoride.set = function(value) {

};

tofma.input.fluoride.get = function() {

};

tofma.input.wavelength.set = function(value) {

};

tofma.input.wavelength.get = function() {

};

tofma.input.a.set = function(value) {

};

tofma.input.a.get = function() {

};

tofma.input.b.set = function(value) {

};

tofma.input.b.get = function() {

};

tofma.input.c.set = function(value) {

};

tofma.input.c.get = function() {

};

tofma.input.q.set = function(value) {

};

tofma.input.q.get = function() {

};

tofma.input.points2D.set = function(value) {

};

tofma.input.points2D.get = function() {

};

tofma.input.points3D.set = function(value) {

};

tofma.input.points3D.get = function() {

};

tofma.input.plot2D.set = function(value) {

};

tofma.input.plot2D.get = function() {

};

tofma.input.plot3D.set = function(value) {

};

tofma.input.plot3D.get = function() {

};

tofma.output.n1.set = function(value) {

};

tofma.output.n1.get = function() {

};

tofma.output.n2.set = function(value) {

};

tofma.output.n2.get = function() {

};

tofma.output.n3.set = function(value) {

};

tofma.output.n3.get = function() {

};

tofma.output.v1.set = function(value) {

};

tofma.output.v1.get = function() {

};

tofma.output.v2.set = function(value) {

};

tofma.output.v2.get = function() {

};

tofma.output.v3.set = function(value) {

};

tofma.output.v3.get = function() {

};

/* ENTRY POINT */
document.addEventListener("DOMContentLoaded", function() {
	/* get modeler DOM, if an error has occurred, stop the program */
	if(!tofma.getModelerDOM()) return null;
});
