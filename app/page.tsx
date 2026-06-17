import Navbar from "./components/layouts/navbar/page";
import Banner from "./components/subPages/Banner/page";
import SectionWrapper from "./components/subPages/Section/page";


export default function Home() {
  return (
    <div className="">
           <Navbar />
           <Banner />
           <SectionWrapper />
    </div>
  );
}
