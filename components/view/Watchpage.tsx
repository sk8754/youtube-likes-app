"use client";
import React from "react";
import VideoPlayer from "../VideoPlayer";
import VideoInfo from "../VideoInfo";
import Comments from "../Comments";
import RecommendedVideos from "../RecommendedVideos";
import Livecomment from "../Livecomment";

const Watchpage = ({ roomId }: { roomId: string }) => {
  return (
    <div className="sm:pl-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VideoPlayer
            isLive={false}
            src={`http://localhost:8000/stream/${roomId}/output.m3u8`}
          />
          <div className="px-[3%] sm:px-0">
            <VideoInfo islive={true} />
            <Comments isLive={true} />
          </div>
        </div>
        <div className="lg:col-span-1 px-[3%] sm:px-0">
          <Livecomment isLive={true} roomId={roomId} />
          <RecommendedVideos />
        </div>
      </div>
    </div>
  );
};

export default Watchpage;
