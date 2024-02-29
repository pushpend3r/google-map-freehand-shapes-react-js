import AppMap from "./components/Map/Map";

function App() {
  return <AppMap onShapeDraw={(polyline) => console.log(polyline)} />;
}

export default App;
