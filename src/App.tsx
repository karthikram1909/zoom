import Interface from "./interface";
import "./App.css";

function App() {
  return (
    <>
      <div className="mb-2">
        <h1 className="text-center font-semibold text-4xl text-orange-500 mb-1">
          Zoom
        </h1>
        <hr className="h-1 border-2  border-orange-500" />
      </div>
      <div>
        <Interface />
      </div>
    </>
  );
}

export default App;
