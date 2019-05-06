/**
 * Lagrange's Interpolation Nodes Type
 *
 * The 'x' and 'y' arrays must be of the same length
 *
 * @typedef {Object} T_LagrangeInterpolationNodes
 * @property {number[]} x - Array of arguments of the interpolated function
 * @property {number[]} y - Array of values of the interpolated function
 *
 */

/**
 * Interpolate the value using the Lagrange polynomials
 *
 * @param {number} x - Value for interpolation
 * @param {T_LagrangeInterpolationNodes} nodes - A set of at least two nodes for interpolation
 * @return {string|number} - Interpolated value or "undefined" when an error occurs
 */
function LagrangeInterpolation(x, nodes)
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
		if(((typeof x) !== "number") || isNaN(x)) throw 5;
		/* each element of the array must be a number */
		for(var _i=0; _i<nodes.x.length ;_i++)
		{
			if(((typeof nodes.x[_i]) !== "number") || isNaN(nodes.x[_i])) throw 6;
			if(((typeof nodes.y[_i]) !== "number") || isNaN(nodes.y[_i])) throw 6;
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
		var errorFunctionName = "LagrangeInterpolation:";

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
				console.error(errorFunctionName, "Bad data type for 'x'",
					"\n\ttypeof(x):", typeof x,
					"\n\tisNaN(x):",  isNaN(x)
				);
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
}

/**
 * Sellmeier's Coefficients Type
 *
 * @typedef {Object} T_SellmeierCoefficients
 * @property {number[]} a - Three coefficients
 * @property {number[]} b - Three coefficients
 */

/** @type {Object} */
var SellmeierCoefficients = {};

/**
 * Calculate Sellmeier's coefficients for germanium admixture
 *
 * @method SellmeierCoefficients.Germanium
 * @param {number} concentration - Molecular concentration of germanium admixture in the optical fiber core [M%]
 * @return {string|T_SellmeierCoefficients} coefficients - Calculated coefficients or "undefined" when an error occurs
 */
SellmeierCoefficients.Germanium = function(concentration)
{
	try {
		/* 'concentration' type must be a number */
		if(((typeof concentration) !== "number") || isNaN(concentration)) throw 1;
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

			return LagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function a2(x) {
			var y_values = [
				0.4079426,
				0.4146307,
				0.4206803,
				0.4254807,
				0.451885
			];

			return LagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function a3(x) {
			var y_values = [
				0.8974994,
				0.8974540,
				0.8956551,
				0.8964226,
				0.704048
			];

			return LagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b1(x) {
			var y_values = [
				0.0684043,
				0.0727723,
				0.0609053,
				0.0617167,
				0.064270
			];

			return LagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b2(x) {
			var y_values = [
				0.1162414,
				0.1143085,
				0.1254514,
				0.1270814,
				0.129408
			];

			return LagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		function b3(x) {
			var y_values = [
				9.8961610,
				9.8961610,
				9.8961620,
				9.8961610,
				9.425478
			];

			return LagrangeInterpolation(x, {x: x_values, y: y_values});
		}

		return {
			a: [a1(concentration), a2(concentration), a3(concentration)],
			b: [b1(concentration), b2(concentration), b3(concentration)]
		};
	} catch(error) {
		/* for a better look in the console */
		var errorFunctionName = "SellmeierCoefficients.Germanium:";

		/* handle the right exception */
		switch(error)
		{
			case 1:
				console.error(errorFunctionName, "Bad data type for 'concentration'",
					"\n\ttypeof(concentration):", typeof concentration,
					"\n\tisNaN(concentration):",  isNaN(concentration)
				);
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
 * Calculate the Sellmeier equation
 *
 * @function Sellmeier
 * @param {number} wavelength - The wavelength [um]
 * @param {T_SellmeierCoefficients} coefficients - Calculated coefficients
 * @return {number} refractiveIndex - Refractive index squared (n^2) or "undefined" when an error occurs
 */
function Sellmeier(wavelength, coefficients)
{
	try {
		/* 'wavelength' type must be a number */
		if(((typeof wavelength) !== "number") || isNaN(wavelength)) throw 1;
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
		for (i=0; i<=2; i++) coefficients.b[i] *= coefficients.b[i];

		for (i=0; i<=2; i++) refractiveIndex += (coefficients.a[i] * wavelength) / (wavelength - coefficients.b[i]);

		return refractiveIndex;
	} catch (error) {
		/* for a better look in the console */
		var errorFunctionName = "Sellmeier:";

		/* handle the right exception */
		switch(error)
		{
			case 1:
				console.error(errorFunctionName, "Bad data type for 'wavelength'",
					"\n\ttypeof(wavelength):", typeof wavelength,
					"\n\tisNaN(wavelength):",  isNaN(wavelength)
				);
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
}
