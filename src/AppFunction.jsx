import { useState } from "./lib/react/ReactHooks";
// eslint-disable-next-line react/prop-types
function AppFunction({id}) {
  const [conter, setConter] = useState(0);

  function addCounter() {
    setConter(conter + 1);
  }

  return (
    <div className="container" id={id}>
      <div className="one">
        <div className="two">
          <p>1</p>
          <p>2</p>
        </div>
        <div className="three">
          <p>3</p>
          <p>4</p>
        </div>
      </div>
      <p>this is a tes1</p>
      <div>
      <button onClick={addCounter}>+</button>
        <span>{ conter }</span>
        <button onClick={() => setConter(conter - 1)}>-</button>
      </div>
    </div>
  );
}

export default AppFunction;
