"use client";

import React, { useState } from "react";
import HomeCard from "./cards/HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./modals/MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";

const MeetingTypesList = () => {
  const [meetingState, setMeetingState] = useState<
    "isInstantMeeting" | "isJoiningMeeting" | "isScheduleMeeting" | undefined
  >();

  const { toast } = useToast();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    meetingLink: "",
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!user || !client) return;

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date-time" });
        return;
      }

      const id = crypto.randomUUID();

      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create call");

      const callStartsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: callStartsAt,
          custom: { description },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
        toast({ title: "🎉 Meeting created " });
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Failed to create meeting" });
    }
  };

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
