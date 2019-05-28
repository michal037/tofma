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
		/* the 'wavelength' must be 0 or be positive */
		if(wavelength < 0) throw 2;
		/* discard the wrong data types for 'coefficients' */
		if(!coefficients) throw 3;
		/* check if 'coefficients' contains the required tables */
		if(!Array.isArray(coefficients.a) || !Array.isArray(coefficients.b)) throw 4;
		/* length of arrays 'coefficients.a' and 'coefficients.b' must be 3 */
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
				console.error(errorFunctionName, "length of array 'coefficients.a' or 'coefficients.b' is not 3",
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
 * @return {boolean} - return 'true' or 'false' when an error occurs
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

		return false;
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

/**
 * Show URL arguments block
 * @param {boolean} show - 'true' or 'false'
 */
tofma.input.urlArgsShow = function(show) {
	tofma.dom.input.urlArguments.block.style.display = (show === true) ? "block" : "none";
};

/**
 * Show error block
 * @param {boolean} show - 'true' or 'false'
 */
tofma.output.errorShow = function(show) {
	tofma.dom.output.error.block.style.display = (show === true) ? "block" : "none";
};

/**
 * Print message to error block
 * @param {string} message
 */
tofma.output.errorPrint = function(message) {
	tofma.dom.output.error.text.innerHTML = message;
};

/**
 * Show output values block
 * @param {boolean} show - 'true' or 'false'
 */
tofma.output.show = function(show) {
	tofma.dom.output.values.block.style.display = (show === true) ? "block" : "none";
};

/**
 * Show N3 in output values block
 * @param {boolean} show - 'true' or 'false'
 */
tofma.output.n3Show = function(show) {
	tofma.dom.output.values.n3Block.style.display = (show === true) ? "table-row" : "none";
};

/**
 * Show V1 in output values block
 * @param {boolean} show - 'true' or 'false'
 */
tofma.output.v3Show = function(show) {
	tofma.dom.output.values.v3Block.style.display = (show === true) ? "table-row" : "none";
};

/**
 * Set profile in UI
 * @param {number} value - profile, one of {1, 2, 3, 4, 5}
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.profile.set = function(value) {
	/* accept: one of {1, 2, 3, 4, 5} */
	if(tofma.isNotNumber(value)) return false;
	if((value < 1) || (value > 5) || !tofma.isInteger(value)) return false;

	/* set value */
	switch(value) {
		case 1: tofma.dom.input.profiles.p1.checked = true; break;
		case 2: tofma.dom.input.profiles.p2.checked = true; break;
		case 3: tofma.dom.input.profiles.p3.checked = true; break;
		case 4: tofma.dom.input.profiles.p4.checked = true; break;
		case 5: tofma.dom.input.profiles.p5.checked = true; break;
	}

	/* no errors */
	return true;
};

/**
 * Get profile from UI
 * @return {number|boolean} - one of {1, 2, 3, 4, 5} or 'false' when an error occurs
 */
tofma.input.profile.get = function() {
	if(tofma.dom.input.profiles.p1.checked) return 1;
	if(tofma.dom.input.profiles.p2.checked) return 2;
	if(tofma.dom.input.profiles.p3.checked) return 3;
	if(tofma.dom.input.profiles.p4.checked) return 4;
	if(tofma.dom.input.profiles.p5.checked) return 5;

	/* error */
	return false;
};

/**
 * Set germanium admixture in UI
 * @param {number} value - accept: <0; 15>
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.germanium.set = function(value) {
	/* accept: number <0; 15> */
	if(tofma.isNotNumber(value)) return false;
	if((value < 0) || (value > 15)) return false;

	tofma.dom.input.arguments.germanium.value = value;
	return true;
};

/**
 * Get germanium admixture from UI
 * @return {number|boolean} - number or 'false' when an error occurs
 */
tofma.input.germanium.get = function() {
	var value = parseFloat(tofma.dom.input.arguments.germanium.value);

	/* accept: number <0; 15> */
	if(tofma.isNotNumber(value)) return false;
	if((value < 0) || (value > 15)) return false;

	return value;
};

/**
 * Set fluoride admixture in UI
 * @param {number} value - accept: <0; 2>
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.fluoride.set = function(value) {
	/* accept: number <0; 2> */
	if(tofma.isNotNumber(value)) return false;
	if((value < 0) || (value > 2)) return false;

	tofma.dom.input.arguments.fluoride.value = value;
	return true;
};

/**
 * Get fluoride admixture from UI
 * @return {number|boolean} - number or 'false' when an error occurs
 */
tofma.input.fluoride.get = function() {
	var value = parseFloat(tofma.dom.input.arguments.fluoride.value);

	/* accept: number <0; 2> */
	if(tofma.isNotNumber(value)) return false;
	if((value < 0) || (value > 2)) return false;

	return value;
};

/**
 * Set wavelength in UI
 * @param {number} value - accept: number>=0
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.wavelength.set = function(value) {
	/* accept: number>=0 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 0) return false;

	tofma.dom.input.arguments.wavelength.value = value;
	return true;
};

/**
 * Get wavelength from UI
 * @return {number|boolean} - number or 'false' when an error occurs
 */
tofma.input.wavelength.get = function() {
	var value = parseFloat(tofma.dom.input.arguments.wavelength.value);

	/* accept: number>=0 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 0) return false;

	return value;
};

/**
 * Set a in UI
 * @param {number} value - accept: number>0
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.a.set = function(value) {
	/* accept: number>0 */
	if(tofma.isNotNumber(value)) return false;
	if(value <= 0) return false;

	tofma.dom.input.arguments.a.value = value;
	return true;
};

/**
 * Get a from UI
 * @return {number|boolean} - number or 'false' when an error occurs
 */
tofma.input.a.get = function() {
	var value = parseFloat(tofma.dom.input.arguments.a.value);

	/* accept: number>0 */
	if(tofma.isNotNumber(value)) return false;
	if(value <= 0) return false;

	return value;
};

/**
 * Set b in UI
 * @param {number} value - accept: number>=0
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.b.set = function(value) {
	/* accept: number>=0 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 0) return false;

	tofma.dom.input.arguments.b.value = value;
	return true;
};

/**
 * Get b from UI
 * @return {number|boolean} - number or 'false' when an error occurs
 */
tofma.input.b.get = function() {
	var value = parseFloat(tofma.dom.input.arguments.b.value);

	/* accept: number>=0 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 0) return false;

	return value;
};

/**
 * Set c in UI
 * @param {number} value - accept: number>=0
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.c.set = function(value) {
	/* accept: number>=0 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 0) return false;

	tofma.dom.input.arguments.c.value = value;
	return true;
};

/**
 * Get c from UI
 * @return {number|boolean} - number or 'false' when an error occurs
 */
tofma.input.c.get = function() {
	var value = parseFloat(tofma.dom.input.arguments.c.value);

	/* accept: number>=0 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 0) return false;

	return value;
};

/**
 * Set q in UI
 * @param {number} value - accept: number>1
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.q.set = function(value) {
	/* accept: number>1 */
	if(tofma.isNotNumber(value)) return false;
	if(value <= 1) return false;

	tofma.dom.input.arguments.q.value = value;
	return true;
};

/**
 * Get q from UI
 * @return {number|boolean} - number or 'false' when an error occurs
 */
tofma.input.q.get = function() {
	var value = parseFloat(tofma.dom.input.arguments.q.value);

	/* accept: number>1 */
	if(tofma.isNotNumber(value)) return false;
	if(value <= 1) return false;

	return value;
};

/**
 * Set points2D in UI
 * @param {number} value - accept: number>=1
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.points2D.set = function(value) {
	/* accept: number>=1 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 1) return false;

	tofma.dom.input.arguments.points2D.value = Math.floor(value);
	return true;
};

/**
 * Get points2D from UI
 * @return {number|boolean} - odd number >=1 or 'false' when an error occurs
 */
tofma.input.points2D.get = function() {
	var value = parseInt(tofma.dom.input.arguments.points2D.value, 10);

	/* accept: number>=1 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 1) return false;

	/* I want odd 'value' for easy centering */
	if((value % 2) === 0) value++;

	return value;
};

/**
 * Set points3D in UI
 * @param {number} value - accept: number>=1
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.input.points3D.set = function(value) {
	/* accept: number>=1 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 1) return false;

	tofma.dom.input.arguments.points3D.value = Math.floor(value);
	return true;
};

/**
 * Get points3D from UI
 * @return {number|boolean} - odd number >=1 or 'false' when an error occurs
 */
tofma.input.points3D.get = function() {
	var value = parseInt(tofma.dom.input.arguments.points3D.value, 10);

	/* accept: number>=1 */
	if(tofma.isNotNumber(value)) return false;
	if(value < 1) return false;

	/* I want odd 'value' for easy centering */
	if((value % 2) === 0) value++;

	return value;
};

/**
 * Set plot2D in UI
 */
tofma.input.plot2D.set = function(value) {
	tofma.dom.input.submits.plot2D.checked = (value === true);
	return true;
};

/**
 * Get plot2D from UI
 * @return {boolean} - 'true' or 'false'
 */
tofma.input.plot2D.get = function() {
	return tofma.dom.input.submits.plot2D.checked === true;
};

/**
 * Set plot3D in UI
 */
tofma.input.plot3D.set = function(value) {
	tofma.dom.input.submits.plot3D.checked = (value === true);
	return true;
};

/**
 * Get plot3D from UI
 * @return {boolean} - 'true' or 'false'
 */
tofma.input.plot3D.get = function() {
	return tofma.dom.input.submits.plot3D.checked === true;
};

/**
 * Set n1 in UI
 * @param {number} value
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.output.n1.set = function(value) {
	if(tofma.isNotNumber(value)) return false;
	tofma.dom.output.values.n1.value = value;
	return true;
};

/**
 * Set n2 in UI
 * @param {number} value
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.output.n2.set = function(value) {
	if(tofma.isNotNumber(value)) return false;
	tofma.dom.output.values.n2.value = value;
	return true;
};

/**
 * Set n3 in UI
 * @param {number} value
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.output.n3.set = function(value) {
	if(tofma.isNotNumber(value)) return false;
	tofma.dom.output.values.n3.value = value;
	return true;
};

/**
 * Set v1 in UI
 * @param {number} value
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.output.v1.set = function(value) {
	if(tofma.isNotNumber(value)) return false;
	tofma.dom.output.values.v1.value = value;
	return true;
};

/**
 * Set v2 in UI
 * @param {number} value
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.output.v2.set = function(value) {
	if(tofma.isNotNumber(value)) return false;
	tofma.dom.output.values.v2.value = value;
	return true;
};

/**
 * Set v3 in UI
 * @param {number} value
 * @return {boolean} - no errors -> 'true' | error -> 'false'
 */
tofma.output.v3.set = function(value) {
	if(tofma.isNotNumber(value)) return false;
	tofma.dom.output.values.v3.value = value;
	return true;
};

/* structure definition for callbacks */
tofma.callback = {};
/* END - structure definition for callbacks - END */

/** callback for URL arguments' cancel button */
tofma.callback.urlArgsCancel = function() {
	tofma.input.urlArgsShow(false);
};

/**
 * Function for URL arguments' load button and for detecting the presence of URL parameters.
 * Callback will only load the correct arguments.
 *
 * @param {boolean} onlyCheck - 'true' -> only detect | 'undefined' or 'false' -> callback for loading arguments
 * <br> onlyCheck=true - returns 'true' if at least one parameter is detected, otherwise 'false'
 * <br> onlyCheck=undefined|false - no errors -> 'true' | errors -> 'false'
 * @return {boolean}
 */
tofma.callback.urlArgsLoad = function(onlyCheck) {
	/*
	 * Support old versions of browsers. There are facilities, but for newer browsers.
	 * Firefox 57 bug: https://bugzil.la/1386683
	 */

	var tempURL, beginIndex, endIndex, args, _i, argsNames, temp;
	var errorFunctionName = "tofma.callback.urlArgsLoad" + ((onlyCheck === true) ? "(true)" : "") + ": ";

	/* decode URL */
	try {
		tempURL = decodeURI(document.URL);
	} catch(error) {
		/* catch malformed URI */
		console.error(errorFunctionName + error.message);
		return false;
	}

	/* get begin index of the query string */
	beginIndex = tempURL.indexOf("?");
	if(beginIndex === -1) { /* catch error */
		if(onlyCheck === true) return false; /* onlyCheck: do not write the error when the query string was not found */
		console.error(errorFunctionName + "The query string was not found in the URL\n\tURL: " + tempURL);
		return false;
	}

	/* get end index of the query string */
	endIndex = tempURL.indexOf("#");

	/* get the query string with the '?' char */
	tempURL = (endIndex === -1) ? tempURL.slice(beginIndex) : tempURL.slice(beginIndex, endIndex);

	args = new URLSearchParams(tempURL);

	/* If the flag 'onlyCheck' is true only return whether the URL contains the query string. */
	if(onlyCheck === true) {
		argsNames = ["profile", "germanium", "fluoride", "wavelength",
			"a", "b", "c", "q", "points2D", "points3D", "plot2D", "plot3D"];

		/* for any occurrence of parameter return true */
		for(_i=0; _i < argsNames.length ;_i++) {
			if(args.has(argsNames[_i])) return true;
		}

		/* If no parameter was found return false */
		return false;
	}

	/* assign the arguments to the inputs */
	argsNames = ["profile", "germanium", "fluoride", "wavelength", "a", "b", "c", "q", "points2D", "points3D"];
	for(_i=0; _i < argsNames.length ;_i++) {
		if(args.has(argsNames[_i])) tofma.input[argsNames[_i]].set(parseFloat(args.get(argsNames[_i])));
	}

	if(args.has("plot2D")) {
		temp = args.get("plot2D");
		if(temp === "true")  tofma.input.plot2D.set(true);
		if(temp === "false") tofma.input.plot2D.set(false);
	}

	if(args.has("plot3D")) {
		temp = args.get("plot3D");
		if(temp === "true")  tofma.input.plot3D.set(true);
		if(temp === "false") tofma.input.plot3D.set(false);
	}

	/* hide the box after loading arguments */
	tofma.input.urlArgsShow(false);

	return true;
};

/** callback for profile1 radio input */
tofma.callback.profile1 = function() {
	/* block unnecessary inputs */
	tofma.dom.input.arguments.fluoride.disabled = true;
	tofma.dom.input.arguments.b.disabled = true;
	tofma.dom.input.arguments.c.disabled = true;
	tofma.dom.input.arguments.q.disabled = true;

	/* clear the inputs */
	var _i;
	var argsNames = ["germanium", "fluoride", "wavelength", "a", "b", "c"];
	for(_i=0; _i < argsNames.length ;_i++) {
		tofma.dom.input.arguments[argsNames[_i]].value = "";
	}
	tofma.input.q.set(4);
	tofma.input.points2D.set(1000);
	tofma.input.points3D.set(1000);
};

/** callback for profile2 radio input */
tofma.callback.profile2 = function() {
	/* block unnecessary inputs */
	tofma.dom.input.arguments.fluoride.disabled = true;
	tofma.dom.input.arguments.b.disabled = true;
	tofma.dom.input.arguments.c.disabled = true;
	tofma.dom.input.arguments.q.disabled = false;

	/* clear the inputs */
	var _i;
	var argsNames = ["germanium", "fluoride", "wavelength", "a", "b", "c"];
	for(_i=0; _i < argsNames.length ;_i++) {
		tofma.dom.input.arguments[argsNames[_i]].value = "";
	}
	tofma.input.q.set(4);
	tofma.input.points2D.set(1000);
	tofma.input.points3D.set(1000);
};

/** callback for profile3 radio input */
tofma.callback.profile3 = function() {
	/* block unnecessary inputs */
	tofma.dom.input.arguments.fluoride.disabled = true;
	tofma.dom.input.arguments.b.disabled = true;
	tofma.dom.input.arguments.c.disabled = true;
	tofma.dom.input.arguments.q.disabled = true;

	/* clear the inputs */
	var _i;
	var argsNames = ["germanium", "fluoride", "wavelength", "a", "b", "c"];
	for(_i=0; _i < argsNames.length ;_i++) {
		tofma.dom.input.arguments[argsNames[_i]].value = "";
	}
	tofma.input.q.set(4);
	tofma.input.points2D.set(1000);
	tofma.input.points3D.set(1000);
};

/** callback for profile4 radio input */
tofma.callback.profile4 = function() {
	/* block unnecessary inputs */
	tofma.dom.input.arguments.fluoride.disabled = false;
	tofma.dom.input.arguments.b.disabled = false;
	tofma.dom.input.arguments.c.disabled = true;
	tofma.dom.input.arguments.q.disabled = true;

	/* clear the inputs */
	var _i;
	var argsNames = ["germanium", "fluoride", "wavelength", "a", "b", "c"];
	for(_i=0; _i < argsNames.length ;_i++) {
		tofma.dom.input.arguments[argsNames[_i]].value = "";
	}
	tofma.input.q.set(4);
	tofma.input.points2D.set(1000);
	tofma.input.points3D.set(1000);
};

/** callback for profile5 radio input */
tofma.callback.profile5 = function() {
	/* block unnecessary inputs */
	tofma.dom.input.arguments.fluoride.disabled = false;
	tofma.dom.input.arguments.b.disabled = false;
	tofma.dom.input.arguments.c.disabled = false;
	tofma.dom.input.arguments.q.disabled = true;

	/* clear the inputs */
	var _i;
	var argsNames = ["germanium", "fluoride", "wavelength", "a", "b", "c"];
	for(_i=0; _i < argsNames.length ;_i++) {
		tofma.dom.input.arguments[argsNames[_i]].value = "";
	}
	tofma.input.q.set(4);
	tofma.input.points2D.set(1000);
	tofma.input.points3D.set(1000);
};

/** callback for plot 2D checkbox */
tofma.callback.submitPlot2D = function() {
	if(tofma.dom.input.submits.plot2D.checked) {
		tofma.dom.input.arguments.points2D.disabled = false;
	} else {
		tofma.dom.input.arguments.points2D.disabled = true;
	}
};

/** callback for plot 3D checkbox */
tofma.callback.submitPlot3D = function() {
	if(tofma.dom.input.submits.plot3D.checked) {
		tofma.dom.input.arguments.points3D.disabled = false;
	} else {
		tofma.dom.input.arguments.points3D.disabled = true;
	}
};

/** callback for generate button */
tofma.callback.submitGenerate = function() {
	function errorUser(message) {
		tofma.output.errorPrint(message);
		tofma.output.errorShow(true);
	}

	var args = {};

	/* hide error box if it was previously opened */
	tofma.output.errorShow(false);

	/* get arguments from UI */
	args.profile = tofma.input.profile.get();
	args.germanium = tofma.input.germanium.get();
	args.fluoride = tofma.input.fluoride.get();
	args.wavelength = tofma.input.wavelength.get();
	args.a = tofma.input.a.get();
	args.b = tofma.input.b.get();
	args.c = tofma.input.c.get();
	args.q = tofma.input.q.get();
	args.points2D = tofma.input.points2D.get();
	args.points3D = tofma.input.points3D.get();

	/* check the data loaded from the inputs */
	if(args.profile === false) {
		errorUser("No <strong>profile</strong> selected.");
		return false;
	}
	if(args.germanium === false) {
		errorUser("The entered value for the <strong>germanium admixture</strong> is outside the acceptable range.");
		return false;
	}
	if(args.wavelength === false) {
		errorUser("The entered value for <strong>wavelength</strong> can not be less than 0.");
		return false;
	}
	if(args.a === false) {
		errorUser("The entered value for <strong>a</strong> parameter can not be less than or equal 0.");
		return false;
	}
  	if((args.profile === 4) || (args.profile === 5)) {
  		if(args.fluoride === false) {
			errorUser("The entered value for the <strong>fluoride admixture</strong> is outside the acceptable range.");
			return false;
		}
  		if(args.b === false) {
			errorUser("The entered value for <strong>b</strong> parameter can not be less than 0.");
			return false;
		}
	}
  	if((args.profile === 5) && (args.c === false)) {
		errorUser("The entered value for <strong>c</strong> parameter can not be less than 0.");
		return false;
	}
	if((args.profile === 2) && (args.q === false)) {
		errorUser("The entered value for <strong>q</strong> parameter can not be less than or equal 1.");
		return false;
	}
	if(tofma.input.plot2D.get() && (args.points2D === false)) {
		errorUser("The entered value for <strong>2D points</strong> can not be less than 1.");
		return false;
	}
	if(tofma.input.plot3D.get() && (args.points3D === false)) {
		errorUser("The entered value for <strong>3D points</strong> can not be less than 1.");
		return false;
	}
};

tofma.makePlot2D = function() {
	alert("plot 2D");
};

tofma.makePlot3D = function() {
	alert("plot 3D");
};

/* ENTRY POINT */
document.addEventListener("DOMContentLoaded", function() {
	/* get modeler DOM, stop the program if an error has occurred */
	if(!tofma.getModelerDOM()) return null;

	/* add callbacks to events */
	tofma.dom.input.urlArguments.cancel.addEventListener("click", tofma.callback.urlArgsCancel);
	tofma.dom.input.urlArguments.load.addEventListener("click", tofma.callback.urlArgsLoad);

	tofma.dom.input.profiles.p1.addEventListener("click", tofma.callback.profile1);
	tofma.dom.input.profiles.p2.addEventListener("click", tofma.callback.profile2);
	tofma.dom.input.profiles.p3.addEventListener("click", tofma.callback.profile3);
	tofma.dom.input.profiles.p4.addEventListener("click", tofma.callback.profile4);
	tofma.dom.input.profiles.p5.addEventListener("click", tofma.callback.profile5);

	tofma.dom.input.submits.plot2D.addEventListener("click", tofma.callback.submitPlot2D);
	tofma.dom.input.submits.plot3D.addEventListener("click", tofma.callback.submitPlot3D);
	tofma.dom.input.submits.generate.addEventListener("click", tofma.callback.submitGenerate);

	/* show box with the question about loading arguments */
	tofma.input.urlArgsShow(tofma.callback.urlArgsLoad(true));
});
