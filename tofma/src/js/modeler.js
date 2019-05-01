/**
 * Calculate the Sellmeier equation.
 *
 * @function Sellmeier
 * @param {number} wavelength - The wavelength value.
 * @param {Object} coefficients - {a:[val_a1, val_a2, val_a3], b:[val_b1, val_b2, val_b3]}
 * @return {number}
 */
function Sellmeier(wavelength, coefficients)
{
	var i; /* for iterator */
	var refractiveIndex = 1;

	wavelength *= wavelength;

	for(i=0; i<=2 ;i++) coefficients.b[i] *= coefficients.b[i];
	for(i=0; i<=2 ;i++) refractiveIndex += (coefficients.a[i] * wavelength) / (wavelength - coefficients.b[i]);

	return refractiveIndex;
}
