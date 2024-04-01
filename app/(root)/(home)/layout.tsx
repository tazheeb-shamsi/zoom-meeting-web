import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <Navbar/>
      <div className="flex">
        <Sidebar/>
        <section className="flex min-h-full flex-1 flex-col px-6 pb-6 py-28 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
      Footer
    </main>
  );
};

export default HomeLayout;