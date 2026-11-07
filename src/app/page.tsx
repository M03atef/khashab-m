"use client";

import { useState } from "react";
import { Header, scrollToId } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Collections, Marquee } from "@/components/site/collections";
import { Advisor } from "@/components/site/advisor";
import { Gallery } from "@/components/site/gallery";
import { Story } from "@/components/site/story";
import { Contact, MobileDock, WhatsAppFab } from "@/components/site/contact";

export default function Home() {
  const [filter, setFilter] = useState("all");

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Collections
          onOpenGallery={(id) => {
            setFilter(id);
            setTimeout(() => scrollToId("gallery"), 350);
          }}
        />
        <Advisor />
        <Gallery filter={filter} setFilter={setFilter} />
        <Story />
      </main>
      <Contact />
      <MobileDock />
      <WhatsAppFab />
    </>
  );
}
