import HeroSection from "@/components/hero";
import Landing from '@/components/landing';
import CreatorBadge from '@/components/creator-badge';

export default function Home() {
  return <>
      <div className="grid-background"/>
      
      <HeroSection />

      <Landing />
      
      <CreatorBadge />
    </>
  ;
}
