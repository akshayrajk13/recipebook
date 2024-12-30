import "./App.css";
import Nav from "./components/Nav";
import Carousel from "./components/Carousel";
import Card from "./components/Card";
import Cardgroup from "./components/Cardgroup";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div id="home"></div>
      <div
        className="container pb-5 pt-5"
        tabIndex="0"
        data-bs-spy="scroll"
        data-bs-target="#navbar"
        data-bs-root-margin="0px 0px -40%"
        data-bs-smooth-scroll="true"
      >
        <Nav />
        <Carousel />
        <Card />
        <About />
        <Cardgroup />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App;
