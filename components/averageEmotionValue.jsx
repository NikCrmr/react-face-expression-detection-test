const EmotionAnalysisComponent = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    console.error("Invalid or missing data.");

    // Handle the error or return early if necessary.
  }

  // Initialize objects to store sums and counts for each emotion
  const sumEmotions = {
    neutral: 0,
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
  };
  const countEmotions = {
    neutral: 0,
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
  };

  // Iterate through the data array
  data.forEach((entry) => {
    Object.keys(entry.experiences).forEach((emotion) => {
      // Add the value to the sum
      sumEmotions[emotion] += entry.experiences[emotion];
      // Increment the count
      countEmotions[emotion]++;
    });
  });

  // Calculate the average for each emotion
  const averageEmotions = {};
  Object.keys(sumEmotions).forEach((emotion) => {
    averageEmotions[emotion] = sumEmotions[emotion] / countEmotions[emotion];
  });

  const averageEmotionsRounded = {};
  Object.keys(sumEmotions).forEach((emotion) => {
    // Round to 2 decimal places
    averageEmotionsRounded[emotion] = +(
      sumEmotions[emotion] / countEmotions[emotion]
    ).toFixed(2);
  });

  console.log("Average Emotions:", averageEmotions);
  console.log("averageEmotionsRounded:", averageEmotionsRounded);

  return (
    <div>
      {/* Render the rounded average values */}
      <h3>Average Rounded Emotions for 20object with a 1000ms fetch</h3>
      <ul>
        {Object.keys(averageEmotionsRounded).map((emotion) => (
          <li key={emotion}>
            {emotion}: {averageEmotionsRounded[emotion]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmotionAnalysisComponent;
