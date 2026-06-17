/**
 * Linear Regression Utility
 * Implements simple linear regression for predicting congestion levels
 * based on population density trends
 */

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

export interface Prediction {
  year: number;
  populationDensity: number;
  predictedCongestion: number;
}

/**
 * Calculate linear regression using least squares method
 * Formula: y = mx + b
 * where m = slope, b = intercept
 */
export const calculateLinearRegression = (
  xValues: number[],
  yValues: number[]
): RegressionResult => {
  const n = xValues.length;

  if (n === 0 || n !== yValues.length) {
    throw new Error("Invalid input: arrays must have the same non-zero length");
  }

  // Calculate means
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

  // Calculate slope (m) and intercept (b)
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += (xValues[i] - xMean) ** 2;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Calculate R-squared (coefficient of determination)
  let ssTotal = 0;
  let ssResidual = 0;

  for (let i = 0; i < n; i++) {
    const predicted = slope * xValues[i] + intercept;
    ssTotal += (yValues[i] - yMean) ** 2;
    ssResidual += (yValues[i] - predicted) ** 2;
  }

  const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  return {
    slope,
    intercept,
    rSquared,
  };
};

/**
 * Predict congestion level based on population density
 */
export const predictCongestion = (
  populationDensity: number,
  regression: RegressionResult
): number => {
  return regression.slope * populationDensity + regression.intercept;
};

/**
 * Generate future predictions based on historical trends
 */
export const generateFuturePredictions = (
  historicalData: { year: number; populationDensity: number; congestionLevel: number }[],
  yearsToPredict: number = 5
): Prediction[] => {
  if (historicalData.length < 2) {
    return [];
  }

  // Sort data by year
  const sortedData = [...historicalData].sort((a, b) => a.year - b.year);

  // Calculate regression for congestion vs population density
  const densities = sortedData.map(d => d.populationDensity);
  const congestions = sortedData.map(d => d.congestionLevel);
  const congestionRegression = calculateLinearRegression(densities, congestions);

  // Calculate regression for population density trend over time
  const years = sortedData.map(d => d.year);
  const densityRegression = calculateLinearRegression(years, densities);

  // Generate predictions
  const predictions: Prediction[] = [];
  const lastYear = sortedData[sortedData.length - 1].year;

  for (let i = 1; i <= yearsToPredict; i++) {
    const futureYear = lastYear + i;
    const predictedDensity = densityRegression.slope * futureYear + densityRegression.intercept;
    const predictedCongestion = predictCongestion(predictedDensity, congestionRegression);

    predictions.push({
      year: futureYear,
      populationDensity: Math.round(predictedDensity * 10) / 10,
      predictedCongestion: Math.round(predictedCongestion * 10) / 10,
    });
  }

  return predictions;
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};
