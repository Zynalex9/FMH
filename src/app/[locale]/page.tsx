import Banner from "@/components/home/Banner";
import ContactUs from "@/components/home/ContactUs";
import GetInvolved from "@/components/home/GetInvolved";
import HelpSection from "@/components/home/Help";
import Languages from "@/components/home/Languages";
import OurServices from "@/components/home/OurServices";

export default function HomePage() {
  return (
    <div className="md:px-24 py-24 bg-cbg">
      <Banner />
      <HelpSection />
      <OurServices />
      <GetInvolved />
      <ContactUs />
      <Languages />
    </div>
  );
}
