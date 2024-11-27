import MainSection from "../components/MainSection";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";


const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="flex ">
        <Sidebar />
        <MainSection />
      </div>
    </div>
  );
};

export default Home;
