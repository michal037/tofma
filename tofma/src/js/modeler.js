
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
					"\n\tisNaN(x):", isNaN(x)
				);
				break;
			case 6:
				console.error(errorFunctionName, "At least one element from the 'nodes.x' or 'nodes.y' array is not a number");
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
 * @property {number[]} a - Three coefficients.
 * @property {number[]} b - Three coefficients.
 */

/** @type {Object} */
var SellmeierCoefficients = {};

/**
 * Calculate Sellmeier's coefficients for germanium admixture.
 *
 * @method SellmeierCoefficients.Germanium
 * @param {number} concentration - Molecular concentration of germanium admixture in the optical fiber core [M%].
 * @return {T_SellmeierCoefficients} coefficients - Calculated coefficients.
 */
SellmeierCoefficients.Germanium = function(concentration)
{
	var pow = Math.pow; /* shorter reference */

	function a1(x) {

	}

	function a2(x) {

	}

	function a3(x) {

	}

	function b1(x) {

	}

	function b2(x) {

	}

	function b3(x) {

	}

	return {
		a: [a1(concentration), a2(concentration), a3(concentration)],
		b: [b1(concentration), b2(concentration), b3(concentration)]
	};
};

/**
 * Calculate the Sellmeier equation.
 *
 * @function Sellmeier
 * @param {number} wavelength - The wavelength [um].
 * @param {T_SellmeierCoefficients} coefficients - Calculated coefficients.
 * @return {number} refractiveIndex - Refractive index squared (n^2).
 */
function Sellmeier(wavelength, coefficients)
{
	var i; /* for iterator */
	var refractiveIndex = 1;

	/* prepare values */
	wavelength *= wavelength;
	for(i=0; i<=2 ;i++) coefficients.b[i] *= coefficients.b[i];

	for(i=0; i<=2 ;i++) refractiveIndex += (coefficients.a[i] * wavelength) / (wavelength - coefficients.b[i]);

	return refractiveIndex;
}
