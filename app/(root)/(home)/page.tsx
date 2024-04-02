import React from "react";
import MeetingTypesList from "../../../components/MeetingTypesList";

const Home = () => {
  const currentDateTime = new Date();

  // Format the time as 10:25 AM/PM
  const timeFormatted = currentDateTime.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dateFormatted = new Intl.DateTimeFormat("en-Us", {
    dateStyle: "full",
  }).format(currentDateTime);

  return (
    <section className="size-full flex flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex flex-col h-full justify-between max-md:px-5 max-md:py-8 lg:p-11  ">
          <h2 className="glassmorphism max-w-[270px] rounded-md py-2 text-center text-base font-normal">
            Upcoming meeting at 1:30 PM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">
              {timeFormatted}
            </h1>
            <p className="font-medium text-sky-1 text-lg lg:text-2xl">
              {dateFormatted}
            </p>
          </div>
        </div>
      </div>

      <MeetingTypesList />
    </section>
  );
};

export default Home;
