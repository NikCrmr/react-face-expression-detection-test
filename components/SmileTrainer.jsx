import "./SmileTrainer.css";

const SmileTrainer = (x) => {
  console.log("x", x.x.current.happy);
  const happy = x.x.current.happy;
  return (
    <div>
      <h1>Smile Trainer Component</h1>
      <p className="SmileTrainer">{happy > 0.5 ? "😃" : "𝐗"}</p>
    </div>
  );
};

export default SmileTrainer;
