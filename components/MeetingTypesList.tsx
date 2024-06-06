"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";
import HomeCard from "./Cards/HomeCard";
import MeetingModal from "./Modals/MeetingModal";

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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
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
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Plan Your Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2 5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select date & time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat={"MMMM d,yyyy h:mm aa"}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              className="w-full  rounded bg-dark-3 focus:outline-none p-2"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Meeting Link Copied",
            });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy meeting link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Paste meeting link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.meetingLink)}
      >
        <Input
          placeholder="Meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) =>
            setValues({ ...values, meetingLink: e.target.value })
          }
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypesList;
