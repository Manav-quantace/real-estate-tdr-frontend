import AccessForm from "./components/sections/access-form";
import Footer from "./components/sections/footer";
import Hero from "./components/sections/hero";
import HowWorks from "./components/sections/how-works";
import Participants from "./components/sections/participants";
import Trust from "./components/sections/trust";
import WhyExchange from "./components/sections/why-exchange";

export default function Home() {
  return (
    <main className='bg-background text-foreground'>
      <Hero />
      <WhyExchange />
      <HowWorks />
      <Participants />
      <AccessForm id="request-access" />
      <Trust />
      <Footer />
    </main>
  )
}
