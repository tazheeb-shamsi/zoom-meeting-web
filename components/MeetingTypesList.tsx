"use client";

import React, { useState } from "react";
import HomeCard from "./cards/HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./modals/MeetingModal";

const MeetingTypesList = () => {
  const [meetingState, setMeetingState] = useState<
    "isInstantMeeting" | "isJoiningMeeting" | "isScheduleMeeting" | undefined
  >();

  const createMeeting = () => {};

  const router = useRouter();

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New meeting"
        description="Start an instant meeting"
        handleClick={() => {
          setMeetingState("isInstantMeeting");
        }}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join meeting"
        description=" via invitation link"
        handleClick={() => {
          setMeetingState("isJoiningMeeting");
        }}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule meeting"
        description="Plan your meeting"
        handleClick={() => {
          setMeetingState("isScheduleMeeting");
        }}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="Recorded"
        description="Meetings you've recorded"
        handleClick={() => router.push("/recordings")}
        className="bg-yellow-1"
      />

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypesList;
