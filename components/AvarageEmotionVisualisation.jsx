import { useState } from "react";

const DynamicSizeDiv = () => {
  const [dataValue, setDataValue] = useState(50); // Set an initial data value

  const handleDataChange = (newValue) => {
    setDataValue(newValue);
  };

  return (
    <div>
      <label>
        Data Value:
        <input
          type="number"
          value={dataValue}
          onChange={(e) => handleDataChange(e.target.value)}
        />
      </label>

      <div
        style={{
          width: `${dataValue}px`, // Set the width based on the data value
          height: `${dataValue}px`, // Set the height based on the data value
          backgroundColor: "lightblue", // Optional: Set background color
          border: "1px solid #ccc", // Optional: Set border
        }}
      >
        {/* Content of the dynamically sized div */}
        Dynamic Size Div
      </div>
    </div>
  );
};

export default DynamicSizeDiv;
