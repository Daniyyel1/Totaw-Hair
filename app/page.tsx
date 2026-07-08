  "use client"

import { useEffect, useState } from "react";
import Footer from "./components/layouts/footer/page";
import Navbar from "./components/layouts/navbar/page";
import Banner from "./components/subPages/Banner/page";
import NewsLetter from "./components/subPages/NewsLetter/page";
import SectionWrapper from "./components/subPages/Section/page";
import { LoaderIcon } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setLoading(false);
    }, 3000)
    return ()=> clearTimeout(timer);
  }, []);

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center ">
          <LoaderIcon
            role="status"
            aria-label="Loading"
            className="size-20 text-[#FFC0CB] mt-30 animate-spin"
          />
        </div>
      ) : (
        <div>
          <Navbar />
          <Banner />
          <SectionWrapper />
          <NewsLetter />
          <Footer />
        </div>
      )}
    </div>
  );
}
