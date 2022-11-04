import { CheckIcon, ClipboardIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import useResponsiveSize from "../hooks/useResponsiveSize";

export const meetingTypes = {
  MEETING: "MEETING",
  ILS: "ILS",
};

export function MeetingDetailsScreen({
  onClickJoin,
  onClickCreateMeeting,
  participantName,
  setParticipantName,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
}) {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [meetingType, setMeetingType] = useState("meeting");
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);
  const padding = useResponsiveSize({
    xl: 6,
    lg: 6,
    md: 6,
    sm: 4,
    xs: 1.5,
  });

  return (
    <div
      className={`flex flex-1 flex-col w-full `}
      style={{
        padding: padding,
      }}
    >
      {iscreateMeetingClicked ? (
        <div className="border border-solid border-gray-400 rounded-xl px-4 py-3  flex items-center justify-center">
          <p className="text-white text-base">
            {meetingType === meetingTypes.MEETING
              ? `Meeting code : ${meetingId}`
              : `Studio code : ${meetingId}`}
          </p>
          <button
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(meetingId);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      ) : isJoinMeetingClicked ? (
        <>
          <input
            defaultValue={meetingId}
            onChange={(e) => {
              setMeetingId(e.target.value);
            }}
            placeholder={
              meetingType === meetingTypes.MEETING
                ? "Enter meeting Id"
                : "Enter studio code"
            }
            className="px-4 py-3 bg-gray-650 rounded-xl text-white w-full text-center"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600">Please enter valid meetingId</p>
          )}
        </>
      ) : null}

      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-white w-full text-center"
          />

          {/* <p className="text-xs text-white mt-1 text-center">
            Your name will help everyone identify you in the meeting.
          </p> */}
          <button
            disabled={participantName.length < 3}
            className={`w-full ${
              participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
            }  text-white px-2 py-3 rounded-xl mt-5`}
            onClick={(e) => {
              if (iscreateMeetingClicked) {
                if (videoTrack) {
                  videoTrack.stop();
                  setVideoTrack(null);
                }
                onClickStartMeeting();
              } else {
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  onClickJoin(meetingId);
                } else setMeetingIdError(true);
              }
            }}
          >
            {iscreateMeetingClicked
              ? meetingType === meetingTypes.MEETING
                ? "Start a meeting"
                : "Join Studio"
              : meetingType === meetingTypes.MEETING
              ? "Join a meeting"
              : "Join Streaming Room"}
          </button>
        </>
      )}

      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <p className="text-white text-base">Select Type</p>
          <div className="flex justify-between w-full mb-4">
            <div class="flex w-28 items-center mr-2 mb-4 mt-2 bg-gray-650 px-2.5 py-2 rounded-lg">
              <input
                id="radio1"
                type="radio"
                name="radio"
                class="hidden"
                value="meeting"
                onClick={(e) => {
                  setMeetingType(e.target.value);
                }}
                checked={meetingType === "meeting"}
              />
              <label
                for="radio1"
                class="flex items-center cursor-pointer text-white"
              >
                <span class="w-4 h-4 inline-block mr-2 rounded-full border border-grey"></span>
                Meeting
              </label>
            </div>

            <div class="flex flex-1 items-center mb-4 mt-2 bg-gray-650 px-2.5 py-2 rounded-lg">
              <input
                id="radio2"
                type="radio"
                name="radio"
                class="hidden"
                value="ILS"
                onClick={(e) => {
                  setMeetingType(e.target.value);
                }}
              />
              <label
                for="radio2"
                class="flex items-center cursor-pointer text-white"
              >
                <span class="w-4 h-4 inline-block mr-2 rounded-full border border-grey"></span>
                Interactive Live Streaming
              </label>
            </div>
          </div>

          <div className="flex items-center justify-center flex-col w-full mt-2">
            <button
              className="w-full bg-purple-350 text-white px-2 py-3 rounded-xl"
              onClick={async (e) => {
                const meetingId = await onClickCreateMeeting();
                setMeetingId(meetingId);
                setIscreateMeetingClicked(true);
              }}
            >
              {meetingType === meetingTypes.MEETING
                ? "Create a meeting"
                : "Join as a Host"}
            </button>
            <button
              className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-5"
              onClick={(e) => {
                setIsJoinMeetingClicked(true);
              }}
            >
              {meetingType === meetingTypes.MEETING
                ? "Join a meeting"
                : "Join as a Viewer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
